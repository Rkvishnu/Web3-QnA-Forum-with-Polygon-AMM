import { BigNumber, ethers } from "ethers";

// * converts the number to a BigNumber with the correct units to keep Solidity happy
 
const makeBig = (value: string | number) => {

    if (typeof value == 'number') {
        value = value.toString();
    }
    return ethers.utils.parseUnits(value)
};
 
const makeNum = (value: BigNumber) => {
    const numStr = ethers.utils.formatUnits(value, 18);
    return numStr.substring(0, numStr.indexOf('.') + 3); //keep only 2 decimals
}

export { makeBig, makeNum };
