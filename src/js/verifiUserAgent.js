const isMobileOrTablet = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    return /iphone|ipod|ipad|android|blackberry|mobile|tablet/.test(userAgent);
};

export default isMobileOrTablet;