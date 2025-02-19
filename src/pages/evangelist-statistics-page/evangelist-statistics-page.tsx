import React, {useState} from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

import {EvangelistStatisticsPageLogic} from "./evangelist-statistics-page-logic";

const EvangelistStatisticsPage: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState(1);
    const [isOpenAccordion, showAccordion] = useState(false);
    const handleToggle = () => {
        showAccordion(prevState => !prevState);
    };
    // const { isOpenAccordion, showAccordion} = EvangelistStatisticsPageLogic();
    // let isOpenAccordion = false;

    return (
        <div className="w-3/4">
            <div>
                <Menu as="div" className="relative inline-block text-left">
                    <div>
                        <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50">
                            Options
                            <ChevronDownIcon aria-hidden="true" className="-mr-1 size-5 text-gray-400" />
                        </MenuButton>
                    </div>

                    <MenuItems
                        transition
                        className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white ring-1 shadow-lg ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                    >
                        <div className="py-1">
                            <MenuItem>
                                <a
                                    href="#"
                                    className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                                >
                                    Account settings
                                </a>
                            </MenuItem>
                            <MenuItem>
                                <a
                                    href="#"
                                    className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                                >
                                    Support
                                </a>
                            </MenuItem>
                            <MenuItem>
                                <a
                                    href="#"
                                    className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                                >
                                    License
                                </a>
                            </MenuItem>
                            <form action="#" method="POST">
                                <MenuItem>
                                    <button
                                        type="submit"
                                        className="block w-full px-4 py-2 text-left text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                                    >
                                        Sign out
                                    </button>
                                </MenuItem>
                            </form>
                        </div>
                    </MenuItems>
                </Menu>
                <div>

                </div>
            </div>
            <h5 className="text-xl font-medium">My Statistics for 2023/2024</h5>
            <div id="accordion-collapse" data-accordion="collapse" className="bg-customBlue/70 rounded-xl"
                 onClick={handleToggle}>
                <h2 id="accordion-collapse-heading-1">
                    <button type="button"
                            className="flex items-center justify-between w-full p-3 font-medium rtl:text-right text-gray-500
                            border border-b-0 border-gray-200 rounded-xl text-white
                            dark:focus:ring-gray-800 hover:bg-customBlue/70 bg-customBlue/70:hover:bg-gray-800 gap-3"
                    >
                        <div className="flex w-full mr-5">
                            <div className="flex-grow flex justify-start">
                                <p>
                                 Month of January
                                </p>
                            </div>
                            {
                                !isOpenAccordion ? (
                                    <div className="flex justify-end font-normal">
                                        <table className="table-auto">
                                            <thead>
                                            <tr className=" ">
                                                <th>PT</th>
                                                <th>NC</th>
                                                <th>FU</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr>
                                                <td>8/8</td>
                                                <td>00</td>
                                                <td>00</td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                ) : null
                            }

                        </div>
                        <svg data-accordion-icon className="w-3 h-3 rotate-180 shrink-0" aria-hidden="true"
                             xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M9 5 5 1 1 5"/>
                        </svg>

                    </button>
                </h2>
                <div>
                    {isOpenAccordion ? (
                        <div className="text-white rounded">
                            <div
                                className="px-5 pr-12 border-0 border-b-0 border-gray-200 dark:border-gray-700 dark:bg-gray-900">
                                <div className="flex w-full">
                                    <div className="flex-grow">
                                        <p className="pt-7">Week 1</p>
                                        <p>Week 2</p>
                                        <p>Week 3</p>
                                        <p>Week 4</p>
                                    </div>
                                    <div className="flex justify-end ">
                                        <table className="table-auto ">
                                            <thead>
                                            <tr>
                                                <th>PT</th>
                                                <th>NC</th>
                                                <th>FU</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr>
                                                <td>2/2</td>
                                                <td>00</td>
                                                <td>00</td>
                                            </tr>
                                            <tr>
                                                <td>0/0</td>
                                                <td>00</td>
                                                <td>00</td>
                                            </tr>
                                            <tr>
                                                <td>6/2</td>
                                                <td>02</td>
                                                <td>02</td>
                                            </tr>
                                            <tr>
                                                <td colSpan={3}>Enter your stats</td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <div className="flex px-5 pb-3">
                                <p className="flex-grow">Lastly updated yesterday at 9am</p>
                                <p className="flex justify-end underline pr-6">Edit</p>
                            </div>
                        </div>
                    ) : null}
                </div>

            </div>


        </div>
    )
};

export default EvangelistStatisticsPage;