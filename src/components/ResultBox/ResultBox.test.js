import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ResultBox from './ResultBox';
import { formatAmountInCurrency } from '../../utils/formatAmountInCurrency';
import { convertPLNToUSD } from '../../utils/convertPLNToUSD';
import { convertUSDToPLN } from '../../utils/convertUSDToPLN';

describe('Component ResultBox', () => {

    it('should render without crashing', () => {
        render(<ResultBox from="PLN" to="USD" amount={100} />);
    })

    it('should render proper info about conversion when PLN -> USD', () => {

        const testCasesPLN = ['100', '25', '150', '235'];

        for (const testObj of testCasesPLN) {
            // render component with proper parameters
            render(<ResultBox from="PLN" to="USD" amount={parseInt(testObj)} />);
            // set access to main div of the component
            const output = screen.getByTestId('output');
            // check if main div shows proper result
            // expect(output).toHaveTextContent('PLN 100.00 = $28.57');
            expect(output).toHaveTextContent(
                `${formatAmountInCurrency(testObj, 'PLN')} = ${convertPLNToUSD(parseInt(testObj)
                )}`
            );
            cleanup();
        }
    });

    it('should render proper info about conversion when USD -> PLN', () => {

        const testCasesUSD = ['23', '57', '80', '14'];

        for (const testObj of testCasesUSD) {
            // render component with proper parameters
            render(<ResultBox from="USD" to="PLN" amount={parseInt(testObj)} />);
            // set access to main div of the component
            const output = screen.getByTestId('output');
            // check if main div shows proper result
            expect(output).toHaveTextContent(
                `${formatAmountInCurrency(testObj, 'USD')} = ${convertUSDToPLN(parseInt(testObj)
                )}`
            );
            cleanup();
        }
    });

    it('should return same result when from and to are both in USD', () => {

        const testCasesUSDtoUSD = ['23', '57', '80', '14'];

        for (const testObj of testCasesUSDtoUSD) {
            // render component with proper parameters
            render(<ResultBox from="USD" to="USD" amount={parseInt(testObj)} />);
            // set access to main div of the component
            const output = screen.getByTestId('output');
            // check if main div shows proper result
            expect(output).toHaveTextContent(
                `${formatAmountInCurrency(testObj, "USD")} = ${formatAmountInCurrency(testObj, "USD")}`
            )
            cleanup();
        }
    });

    it('should return same result when from and to are both in PLN', () => {

        const testCasesPLN = ['100', '25', '150', '235'];

        for (const testObj of testCasesPLN) {
            render(<ResultBox from="PLN" to="PLN" amount={parseInt(testObj)} />);
            const output = screen.getByTestId('output');
            expect(output).toHaveTextContent(
                `${formatAmountInCurrency(testObj, "PLN")} = ${formatAmountInCurrency(testObj, "PLN")}`
            )
            cleanup();
        }
    });

    it('should render "Wrong value..." statement when input is negative', () => {

        const testCasesNegativeValues = [
            { amount: '-100', from: 'PLN', to: 'USD' },
            { amount: '-20', from: 'USD', to: 'PLN' },
            { amount: '-200', from: 'PLN', to: 'USD' },
            { amount: '-345', from: 'USD', to: 'PLN' },
        ];

        for (const testObj of testCasesNegativeValues) {
            render(<ResultBox amount={parseInt(testObj.amount)} from={testObj.from} to={testObj.to} />)
            const output = screen.getByTestId('outputNegative');
            expect(output).toHaveTextContent(
                'Wrong value...'
            )
            cleanup();
        }
    });
});