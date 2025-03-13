import React, {useState} from "react";
import Input from '../dashboard/Input'
import {useForm} from "react-hook-form";
import {Button} from "@headlessui/react";
import InputComponent from "../component UI/inputComponent";


const StatisticsForm: React.FC = () => {
    const {register,
        handleSubmit,
        formState: {errors}} = useForm();
    console.log(register(''));
    const data = useForm()
    console.log(data)

    // const [statisticsForm, setForm] = useState([
    //
    // ]);

    return (
        <div>
            <form onSubmit={handleSubmit(data => console.log(data))}>
                <h2 className="text-2xl font-bold mb-6 text-center">Add Statistics</h2>
                <div className="space-y-3">
                    <InputComponent
                        label='Ecomist challenge'
                        type="text"
                        name="ecomist-challenge"
                        placeholder="Challenge name  - 2/week"
                        register={register}
                        validation={{ required: "Challenge is required", minLength: { value: 3, message: "Minimum 3 characters" }}}
                        error="errors.ecomist-challenge"
                    />
                    <InputComponent
                        label='Date'
                        type="date"
                        name="date"
                        register={register}
                    />
                    <div>
                        <label className="mt-10">Weekly statistics</label>
                    </div>
                    <div className="flex justify-between gap-40">
                    <div className="flex justify-between gap-x-24">
                            <div className="flex">
                                <label className="pt-2 pr-2">PT:</label>
                                <InputComponent
                                    type="text"
                                    name="preachedTo"
                                    placeholder="02"
                                    register={register}
                                />
                            </div>
                            <div className="flex">
                                <label className="pt-2 pr-2">NC:</label>
                                <InputComponent
                                    type="NC"
                                    name="newConvert"
                                    placeholder="00"
                                    register={register}
                                />
                            </div>
                            <div className="flex">
                                <label className="pt-2 pr-2">FU:</label>
                                <InputComponent
                                    type="text"
                                    name="followUp"
                                    placeholder="00"
                                    register={register}
                                />
                            </div>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="message" className="pt-2">
                            Difficulties
                        </label>
                        <textarea {...register('difficulties')}
                                  id="message" rows="4"
                                  name="difficulties"
                                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                  placeholder="Write your difficuties here...">
                        </textarea>
                    </div>
                </div>
                <div className='mt-10 flex items-center justify-center bg-red-900'>
                    <Button title="Save statistics" className="text-5xl"></Button>
                    <button className="text-xl bg-customBlue">Save statistics</button>
                </div>

            </form>
        </div>
    )
}

export default StatisticsForm;