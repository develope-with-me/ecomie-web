import React, {useState} from "react";
import DashboardWrapper from "../wrapper-layout/DashboardWrapper";
import Modal from "../../component/modal/Modal";
import StatisticsData from "../../component/statistics/statisticsData";
import StatisticsForm from "../../component/statistics/statisticsForm";

const EvangelistStatisticsPage: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState(1);
    const [openForm, setOpenForm] = useState(false);
    const [editIndex, setEditIndex] = useState<number | null>(null);

    const handleLeftButtonClick = () => {

    };

    const handleAddStatisticsForm = () => {
        setOpenForm(!openForm);
    };

    const selectButtonProps = {
        title: 'Select year',
        onClick: handleLeftButtonClick,
    }
    const addModalButtonProps = {
        title: 'Add statistics',
        onClick: handleAddStatisticsForm,
    }
    const closeForm = () => {
        setOpenForm(false);
        setEditIndex(null);
    }
    return (
        <DashboardWrapper selectButtonProps={selectButtonProps} addModalButtonProps={addModalButtonProps}>
            <div className="w-3/4">
                <h5 className="text-xl pt-7 font-medium">My Statistics for 2023/2024</h5>
                <div className={`overlay-menu ${openForm ? 'block' : 'hidden'}`}>
                    <Modal onClose={closeForm}>
                        <div className=''>
                            <StatisticsForm/>
                        </div>
                    </Modal>
                </div>
                <StatisticsData/>

            </div>
        </DashboardWrapper>
    );
};

export default EvangelistStatisticsPage;