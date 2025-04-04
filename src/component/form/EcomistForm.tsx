import React, {useState} from 'react'
import Input from '../dashboard/Input'
import Button from '../component UI/Button';


interface EcomistFormProps {
    onSubmit: (data: { [key: string]: string }) => void;
    initialData?: { [key: string]: string };

}

const EcomistForm: React.FC<EcomistFormProps> = ({onSubmit}) => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: "",
        locality: '',
        role: '',
        contact: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmitForm = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('my form is', formData);
        onSubmit(formData);
    }


    return (
        <div>
            <form onSubmit={handleSubmitForm} className="max-w-md mx-auto ">
                <h2 className="text-2xl font-bold mb-6 text-center">Create an account</h2>

                <div className="space-y-2">
                    <Input
                        label='FullName'
                        type="text"
                        name="fullName"
                        placeholder="Full name"
                        value={formData.fullName}
                        onChange={handleChange}
                    />
                    <Input
                        label='Email'
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    <Input
                        label='Locality'
                        type="text"
                        name="locality"
                        placeholder="Locality"
                        value={formData.locality}
                        onChange={handleChange}
                    />
                    <Input
                        label='Role'

                        type="text"
                        name="role"
                        placeholder="Role"
                        value={formData.role}
                        onChange={handleChange}
                    />
                    <Input
                        label='Contact'
                        type="text"
                        name="contact"
                        placeholder="Contact"
                        value={formData.contact}
                        onChange={handleChange}
                    />
                </div>

                <div className='mt-10 flex items-center justify-center'>
                    <Button title='Create an Account'/>
                </div>
            </form>

        </div>
    )
}

export default EcomistForm
