import React, { useState } from 'react'
import EcomistForm from '../../../component/dashboard/form/EcomistForm';
import Modal from '../../../component/modal/Modal';
import DashboardWrapper from '../../wrapper-layout/DashboardWrapper';
import ListEcomist from '../component/ListEcomist';


const EcomistPage: React.FC = () => {

const [openForm, setOpenForm]=useState(false);
const [editIndex, setEditIndex] = useState<number | null>(null);
const [data, setData] = useState<Array<{ [key: string]: string }>>([]);




    const handleLeftButtonClick = () => {

      };
    
      const handleAddFormEcomist = () => {
        setOpenForm(!openForm);
      };

      const closeForm =()=>{
        setOpenForm(false);
        setEditIndex(null);
      }
      const handleSubmitForm = (formData: { [key: string]: string }) => {
        if (editIndex !== null) {
          // Update existing data
          const updatedData = [...data];
          updatedData[editIndex] = formData;
          setData(updatedData);
        } else {
          // Add new data
          setData([...data, formData]);
        }
        closeForm(); // Close the form after submission
      };

      const handleEdit = (index: number) => {
        setEditIndex(index);
        setOpenForm(true); // Open the form with the data to edit
      };
    
      const handleDelete = (index: number) => {
        const updatedData = data.filter((_, i) => i !== index);
        setData(updatedData);
      };
      
const leftButtonProps={
    title: 'search by name',
    onClick: handleLeftButtonClick, 
}
const rightButtonProps={
    title: 'Add account',
    onClick: handleAddFormEcomist, 
}


    return (
        
      <DashboardWrapper leftButtonProps={leftButtonProps} rightButtonProps={rightButtonProps}>



<div className={`overlay-menu ${openForm ?'block':'hidden'}`} >
<Modal onClose={closeForm} >
   <div className='' >
     <EcomistForm
     onSubmit={handleSubmitForm}
     initialData={editIndex !== null ? data[editIndex] : undefined}
     />
   </div>
   </Modal>
   </div>
   <div className="mt-6">
        <ListEcomist data={data} OnEdite={handleEdit} OnDelete={handleDelete} />
      </div>
      </DashboardWrapper>

    );
  };
  
  export default EcomistPage;
