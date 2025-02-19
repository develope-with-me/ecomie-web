export const EvangelistStatisticsPageLogic = () => {
    let isOpenAccordion: boolean = false;
    const showAccordion = () => {
        console.log('Hello')
        console.log(isOpenAccordion)
        isOpenAccordion = !isOpenAccordion
    }

    return {isOpenAccordion, showAccordion}
}