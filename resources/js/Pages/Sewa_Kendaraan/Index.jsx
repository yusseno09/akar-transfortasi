import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Inertia } from "@inertiajs/inertia";
import { Head, Link, usePage } from "@inertiajs/react";
import {
    IoAddOutline,
    IoPencil,
    IoTrash,
    IoSearch,
    IoCloseOutline,
} from "react-icons/io5";
import RupiahFormat from "@/Utils/RupiahFormat";
import FormatDateRange from "@/Utils/FormatDateRange";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { id } from "date-fns/locale"; // import bahasa Indonesia
import { format } from "date-fns";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file

export default function Index({
    auth,
    sewaKendaraans,
    searchTerm: initialSearchTerm,
    startDate: initialStartDate,
    endDate: initialEndDate,
}) {
    const [searchTerm, setSearchTerm] = useState(initialSearchTerm || "");
    const [state, setState] = useState([
        {
            startDate: initialStartDate ? new Date(initialStartDate) : null,
            endDate: initialEndDate ? new Date(initialEndDate) : null,
            key: "selection",
        },
    ]);
    const [showDateRangePicker, setShowDateRangePicker] = useState(false);
    console.log(showDateRangePicker);

    const handleDelete = (id) => {
        if (
            confirm(
                "Apakah Anda yakin ingin menghapus data sewa kendaraan ini?"
            )
        ) {
            Inertia.delete(route("sewa_kendaraan.destroy", id));
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const startDate = state[0].startDate
            ? format(state[0].startDate, "yyyy-MM-dd")
            : null;
        const endDate = state[0].endDate
            ? format(state[0].endDate, "yyyy-MM-dd")
            : null;

        const query = {
            search: searchTerm,
        };

        if (startDate && endDate) {
            query.startDate = startDate;
            query.endDate = endDate;
        }

        Inertia.get(route("sewa_kendaraan.index"), query, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleResetDateRange = () => {
        setState([
            {
                startDate: null,
                endDate: null,
                key: "selection",
            },
        ]);

        setShowDateRangePicker(false);

        Inertia.get(
            route("sewa_kendaraan.index"),
            {
                search: searchTerm,
            },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const { flash } = usePage().props;

    useEffect(() => {
        if (flash.message) {
            toast(flash.message);
        }
    }, [flash]);

    useEffect(() => {
        if (flash.success) {
            toast("Kendaraan berhasil dihapus");
        }
    }, [flash.success]);

    const startDate = state[0].startDate
        ? format(state[0].startDate, "yyyy-MM-dd")
        : "";
    const endDate = state[0].endDate
        ? format(state[0].endDate, "yyyy-MM-dd")
        : "";

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-4xl text-gray-800 leading-tight w-full">
                    Tabel Sewa Kendaraan
                </h2>
            }
        >
            <Head title="Sewa Kendaraan" />

            <div className="py-8 w-full">
                <div className="flex mb-2 w-full justify-between items-center">
                    <div className="flex mb-2 w-full justify-between">
                        <div className="flex-grow">
                            <form
                                onSubmit={handleSearch}
                                className="flex flex-col w-full space-y-2"
                            >
                                <div className="flex flex-row space-x-2 items-center">
                                    <input
                                        type="text"
                                        className="sm:text-xs md:text-sm w-64 text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-100 rounded-md px-2 py-1 focus:outline-none focus:border-blue-500"
                                        placeholder="Search..."
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                    />
                                </div>
                                <div>
                                    <div className="flex flex-row sm:text-xs md:text-sm text-gray-700">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowDateRangePicker(
                                                    !showDateRangePicker
                                                )
                                            }
                                            className="mb-2 px-2 py-1 flex items-center space-x-2"
                                        >
                                            {startDate && endDate ? (
                                                <>
                                                    <span className="mr-1">
                                                        Filter tanggal
                                                    </span>
                                                    <div className="py-1 px-2 rounded-lg bg-green-400">
                                                        <FormatDateRange
                                                            startDateString={
                                                                startDate
                                                            }
                                                            endDateString={
                                                                endDate
                                                            }
                                                        />
                                                    </div>
                                                </>
                                            ) : (
                                                <span>Filter tanggal ... </span>
                                            )}
                                        </button>
                                        {startDate && endDate ? (
                                            <IoCloseOutline
                                                onClick={handleResetDateRange}
                                                className="text-red-600 text-xl mt-2 cursor-pointer"
                                            />
                                        ) : (
                                            <></>
                                        )}
                                    </div>

                                    {showDateRangePicker && (
                                        <div className="absolute z-10 mt-2 drop-shadow-lg shadow-slate-500">
                                            <div className="flex">
                                                <DateRange
                                                    editableDateInputs={false}
                                                    onChange={(item) =>
                                                        setState([
                                                            item.selection,
                                                        ])
                                                    }
                                                    moveRangeOnFirstSelection={
                                                        false
                                                    }
                                                    ranges={state}
                                                    locale={id}
                                                    startDatePlaceholder={
                                                        "Tanggal Mulai"
                                                    }
                                                    endDatePlaceholder={
                                                        "Tanggal Akhir"
                                                    }
                                                />
                                                <div>
                                                    <button
                                                        type="submit"
                                                        className="px-4 bg-slate-50 py-2 mt-3 ml-4 border rounded-md"
                                                    >
                                                        <IoSearch className="text-xl" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </form>
                        </div>
                        {!showDateRangePicker && (
                            <div className="flex items-end">
                                <a
                                    href={route("sewa_kendaraan.create")}
                                    className=" text-xl px-2 py-1 text-slate-900 hover:text-blue-600"
                                >
                                    <IoAddOutline />
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                {!showDateRangePicker && (
                    <>
                        <div className="overflow-x-auto">
                            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                    <thead className="sm:text-xs md:text-sm text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="px-3 py-2"
                                            >
                                                No
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-2"
                                            >
                                                Tanggal
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-2"
                                            >
                                                Nama
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-2"
                                            >
                                                Jenis
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-2"
                                            >
                                                Harga
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-2"
                                            >
                                                Keterangan
                                            </th>
                                            <th
                                                scope="col"
                                                className="py-3 px-1 text-center"
                                            >
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sewaKendaraans.data.length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan="8"
                                                    className="px-6 py-4 text-center bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                                                >
                                                    Sewa Kendaraan tidak ditemukan
                                                </td>
                                            </tr>
                                        ) : (
                                            sewaKendaraans.data.map(
                                                (kendaraan, index) => (
                                                    <tr
                                                        key={kendaraan.id}
                                                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                                                    >
                                                        <td className="px-3 py-2">
                                                            {sewaKendaraans.from +
                                                                index}
                                                        </td>
                                                        <td className="px-3 py-2">
                                                            <FormatDateRange
                                                                startDateString={
                                                                    kendaraan.mulai_tanggal
                                                                }
                                                                endDateString={
                                                                    kendaraan.akhir_tanggal
                                                                }
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2">
                                                            {kendaraan.nama}
                                                        </td>
                                                        <td className="px-3 py-2">
                                                            {
                                                                kendaraan
                                                                    .kendaraan
                                                                    .nama
                                                            }{" "}
                                                            <br /> ({" "}
                                                            {
                                                                kendaraan
                                                                    .kendaraan
                                                                    .no_registrasi
                                                            }{" "}
                                                            )
                                                        </td>
                                                        <td className="px-3 py-2">
                                                            <RupiahFormat
                                                                value={
                                                                    kendaraan.harga
                                                                }
                                                            />{" "}
                                                            <br /> ({" "}
                                                            {kendaraan.metode} ){" "}
                                                        </td>
                                                        <td className="px-3 py-2">
                                                            {
                                                                kendaraan.keterangan
                                                            }
                                                        </td>
                                                        <td className="px-1 py-4 flex justify-center space-x-2">
                                                            <a
                                                                href={route(
                                                                    "sewa_kendaraan.edit",
                                                                    kendaraan.id
                                                                )}
                                                                className="px-2 py-1 text-center hover:text-yellow-600"
                                                            >
                                                                <IoPencil />
                                                            </a>
                                                            <button
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        kendaraan.id
                                                                    )
                                                                }
                                                                className="px-2 py-1 text-center hover:text-red-600"
                                                            >
                                                                <IoTrash />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                )
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="mt-4 flex justify-between">
                            <div>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    Menampilkan {sewaKendaraans.from}-
                                    {sewaKendaraans.to} dari{" "}
                                    {sewaKendaraans.total} total data
                                </p>
                            </div>
                            <div>
                                {sewaKendaraans.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url}
                                        className={`mx-1 px-3 py-1 border rounded ${
                                            link.active
                                                ? "bg-blue-500 text-white"
                                                : "bg-white text-blue-500"
                                        }`}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
            <ToastContainer autoClose={7000} />
        </AuthenticatedLayout>
    );
}
