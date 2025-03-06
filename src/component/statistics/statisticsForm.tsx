import React, {useState} from "react";
import Input from '../dashboard/Input'
import {useForm} from "react-hook-form";
import {Button} from "@headlessui/react";


const StatisticsForm: React.FC = () => {
    // const {statisticsForm} = useForm();

    const [statisticsForm, setForm] = useState([
        {
            // label:
        },
        {}, {}
    ]);
    return (
        <div>
            <form action="">
                <h2 className="text-2xl font-bold mb-6 text-center">Add Statistics</h2>
                <div className="space-y-2">
                    <Input
                        label='Ecomist challenge'
                        type="text"
                        name="ecomist-challenge"
                        placeholder="Challenge name  - 2/week"
                    />
                    <Input
                        label='Date'
                        type="date"
                        name="date"
                    />
                    <label className="mt-4">Weekly statistics</label>
                    <div className="flex justify-between">
                        <div className="flex flex-wrap">
                            <label className="pt-2 pr-2">PT:</label>
                            <div className="w-2">
                                <Input
                                    type="number"
                                    name="preachedTo"
                                    placeholder="02"
                                />
                            </div>
                            <span className="pt-2 pl-9">/02</span>
                        </div>
                        <div className="flex flex-wrap">
                            <label className="pt-2 pr-2">NC:</label>
                            <div className="w-2">
                                <Input
                                    type="number"
                                    name="newConvert"
                                    placeholder="00"
                                />
                            </div>
                        </div>
                        <div className="flex flex-wrap">
                            <label className="pt-2 pr-2 pl-9 ">FU:</label>
                            <div className="w-2 pr-9">
                                <Input
                                    type="number"
                                    name="followUp"
                                    placeholder="00"
                                />
                            </div>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="message">
                            Difficulties
                        </label>
                        <textarea id="message" rows="4"
                                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                  placeholder="Write your difficuties here...">
                        </textarea>
                        <Button title="Save statistics" ></Button>

                    </div>
                    <div className='mt-10 flex items-center justify-center bg-red-900'>
                        <Button title="Save statistics" className="text-5xl" ></Button>
                    </div>


                </div>
            </form>
        </div>
    )
}

export default StatisticsForm;