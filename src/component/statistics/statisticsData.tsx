import React, {useState} from "react";

const StatisticsData: React.FC = () => {
    const [isOpenAccordion, showAccordion] = useState(false);
    const handleToggle = () => {
        showAccordion(!isOpenAccordion);
    };

    return (
        <div>
            <div id="accordion-collapse" data-accordion="collapse" className="bg-customBlue/70 mt-4 rounded-xl"
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
                                !isOpenAccordion && (
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
                                )
                            }

                        </div>
                        <svg data-accordion-icon className="w-3 h-3 rotate-180 shrink-0" aria-hidden="true"
                             xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                  stroke-width="2"
                                  d="M9 5 5 1 1 5"/>
                        </svg>

                    </button>
                </h2>
                <div>
                    {isOpenAccordion && (
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
                    )
                    }
                </div>
            </div>
        </div>
    )
}

export default StatisticsData