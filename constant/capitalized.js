const Capitalized = (str) => {
    return str?.charAt(0)?.toUpperCase() + str?.slice(1)?.toLowerCase()
}


export default Capitalized



export const courierStatusFormate = (str) => {
    const transformedString = str
        ?.replace(/_/g, ' ')
        ?.replace(/\b\w/g, match => match.toUpperCase());

    return transformedString
}
