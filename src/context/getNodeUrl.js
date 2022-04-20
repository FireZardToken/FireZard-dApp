import random from 'lodash/random';

// Array of available nodes to connect to
export const nodes = [
    'https://bsc-dataseed1.ninicoin.io',
    'https://bsc-dataseed1.defibit.io',
    'https://bsc-dataseed.binance.org',
];

export const test_nodes = [
    'https://data-seed-prebsc-1-s1.binance.org:8545/',
    'https://data-seed-prebsc-2-s1.binance.org:8545/',
    'https://data-seed-prebsc-1-s2.binance.org:8545/',
    'https://data-seed-prebsc-2-s2.binance.org:8545/',
    'https://data-seed-prebsc-1-s3.binance.org:8545/',
    'https://data-seed-prebsc-2-s3.binance.org:8545/'
];

const getNodeUrl = () => {
    const randomIndex = random(0, nodes.length - 1);
    return nodes[randomIndex];
};

const getTestNodeUrl = () => {
    const randomIndex = random(0, test_nodes.length - 1);
    return test_nodes[randomIndex];
};



export { getNodeUrl, getTestNodeUrl };
