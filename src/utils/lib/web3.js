import Web3 from 'web3';

export const getWeb3 = (library) => {
    return new Web3(
        // Replace YOUR-PROJECT-ID with a Project ID from your Infura Dashboard
        library || new Web3.providers.HttpProvider('https://main-light.eth.linkpool.io')
    );
};

export default getWeb3;