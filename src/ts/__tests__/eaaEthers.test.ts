
import * as eeaEthers from '../index'
import {EeaWallet, providers, EeaTransactionRequest, PrivacyGroupOptions, utils, generatePrivacyGroup} from '../index'

jest.setTimeout(15000)

const urlNode1 = "http://localhost:20000";
const providerNode1 = new providers.EeaJsonRpcProvider(urlNode1);
providerNode1.on('debug', (info) => {
    console.log(`Sent "${info.action}" action to node 1 with request: ${JSON.stringify(info.request)}\nResponse: ${JSON.stringify(info.response)}`);
})

const urlNode2 = "http://localhost:20002";
const providerNode2 = new providers.EeaJsonRpcProvider(urlNode2);
providerNode2.on('debug', (info) => {
    console.log(`Sent "${info.action}" action to node 2 with request: ${JSON.stringify(info.request)}\nResponse: ${JSON.stringify(info.response)}`);
})

const urlNode3 = "http://localhost:20004";
const providerNode3 = new providers.EeaJsonRpcProvider(urlNode3);
providerNode3.on('debug', (info) => {
    console.log(`Sent "${info.action}" action to node 3 with request: ${JSON.stringify(info.request)}\nResponse: ${JSON.stringify(info.response)}`);
})

const node1 = 'A1aVtMxLCUHmBVHXoZzzBgPbW/wj5axDpW9X8l91SGo='
const node2 = 'Ko2bVqD+nNlNYL5EE7y3IdOnviftjiizpjRt+HTuFBs='
const node3 = 'k2zXEin4Ip/qBGlRkJejnGWdP9cjkK+DAvKNW31L2C8='

describe('EEA Ethers', () => {

    let node1EnodeUrl: string

    beforeAll(async () => {
        node1EnodeUrl = await providerNode1.send('net_enode', [])
        console.log(`enode url ${node1EnodeUrl}\nnode1 public key: ${node1EnodeUrl.substring(9, 136)}`)
    })

    test('Check overridden functions have been exported', ()=> {
        expect(eeaEthers).toBeDefined()
        expect(eeaEthers.utils).toBeDefined()
        expect(eeaEthers.utils.serialize).toBeInstanceOf(Function)
        expect(eeaEthers.utils.encode).toBeInstanceOf(Function)
        expect(eeaEthers.providers.EeaJsonRpcSigner).toBeInstanceOf(Function)
        expect(eeaEthers.providers.EeaJsonRpcProvider).toBeInstanceOf(Function)
    })

    test('signed transaction matches EEA client', async() => {

        // fe3b557e8fb62b89f4916b721be55ceb828dbd73
        const privateKey = '0x8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63'
        let wallet = new EeaWallet(privateKey)

        // deploy a contract
        const unsignedTransaction: EeaTransactionRequest = {
            nonce: 0,
            gasPrice: 0,
            gasLimit: 3000000,
            // to: undefined,
            value: 0,
            data: '0x608060405234801561001057600080fd5b50336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550610221806100606000396000f300608060405260043610610057576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680633fa4f2451461005c5780636057361d1461008757806367e404ce146100b4575b600080fd5b34801561006857600080fd5b5061007161010b565b6040518082815260200191505060405180910390f35b34801561009357600080fd5b506100b260048036038101908080359060200190929190505050610115565b005b3480156100c057600080fd5b506100c96101cb565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6000600254905090565b7fc9db20adedc6cf2b5d25252b101ab03e124902a73fcb12b753f3d1aaa2d8f9f53382604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019250505060405180910390a18060028190555033600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b6000600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050905600a165627a7a723058208efaf938851fb2d235f8bf9a9685f149129a30fe0f4b20a6c1885dc02f639eba0029',
            chainId: 2018,
            privateFrom: node1,
            privateFor: [node2],
            restriction: 'restricted',
        }

        // From web3js-eea eventEmitter example
        const eeaSignedRlpEncoded = '0xf9031f8080832dc6c08080b90281608060405234801561001057600080fd5b50336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550610221806100606000396000f300608060405260043610610057576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680633fa4f2451461005c5780636057361d1461008757806367e404ce146100b4575b600080fd5b34801561006857600080fd5b5061007161010b565b6040518082815260200191505060405180910390f35b34801561009357600080fd5b506100b260048036038101908080359060200190929190505050610115565b005b3480156100c057600080fd5b506100c96101cb565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6000600254905090565b7fc9db20adedc6cf2b5d25252b101ab03e124902a73fcb12b753f3d1aaa2d8f9f53382604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019250505060405180910390a18060028190555033600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b6000600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050905600a165627a7a723058208efaf938851fb2d235f8bf9a9685f149129a30fe0f4b20a6c1885dc02f639eba0029820fe7a0ea2340ef4a0d32e2c44fed9b8d880a38a1ecfbef618ca0234a404c2360719617a063acf2ee8286787f3ebb640da56ded5952c8bdc8d1bf374e2dfe5afdeb79bea8a0035695b4cc4b0941e60551d7a19cf30603db5bfc23e5ac43a56f57f25f75486ae1a02a8d9b56a0fe9cd94d60be4413bcb721d3a7be27ed8e28b3a6346df874ee141b8a72657374726963746564'

        const signedTransaction = await wallet.signPrivateTransaction(unsignedTransaction)
        expect(signedTransaction).toEqual(eeaSignedRlpEncoded)

        const parsedTransaction = providerNode1.formatter.transaction(signedTransaction)
        expect(parsedTransaction.nonce).toEqual(unsignedTransaction.nonce)
        expect(parsedTransaction.data).toEqual(unsignedTransaction.data)
    })

    describe('getPrivateTransactionReceipt', () => {
        test('missing hash', async () => {
            const result = await providerNode1.getPrivateTransactionReceipt('0x0000000000000000000000000000000000000000000000000000000000000001')
            expect(result).toBeNull()
        })
    })

    describe('Create privacy group and send transactions', () => {

        let testPrivacyGroupOptions: PrivacyGroupOptions
        let privateNonceNode3: number
        let publicNonce: number
        let txHash: string

        const txFromAddress = '0x7E5F4552091A69125d5DfCb7b8C2659029395Bdf'
        const privateKey = '0x0000000000000000000000000000000000000000000000000000000000000001'
        let eeaWallet = new EeaWallet(privateKey)

        test('Create new privacy group', async () => {
            const testPrivacyGroupId = await providerNode3.createPrivacyGroup(
                node3,
                'Node 1 & 3',
                'node3, [node1, node3]',
                [node1, node3])
            expect(testPrivacyGroupId).toMatch(utils.RegEx.base64)
            expect(testPrivacyGroupId).toHaveLength(44)

            testPrivacyGroupOptions = {
                privateFor: testPrivacyGroupId
            }
        })

        describe('pre transaction checks', () => {
            test('get private transaction count from node 3', async () => {
                const privateNonce = await providerNode3.getPrivateTransactionCount(txFromAddress, testPrivacyGroupOptions)
                expect(privateNonce).toBeGreaterThanOrEqual(0)
            })

            test('get private transaction count from node 2', async () => {
                const privateNonce = await providerNode2.getPrivateTransactionCount(txFromAddress, testPrivacyGroupOptions)
                expect(privateNonce).toBeGreaterThanOrEqual(0)
            })

            test('get private transaction count from node 1', async () => {
                const privateNonce = await providerNode1.getPrivateTransactionCount(txFromAddress, testPrivacyGroupOptions)
                expect(privateNonce).toBeGreaterThanOrEqual(0)
            })

            test('get public transaction count from node 3', async () => {
                publicNonce = await providerNode3.getTransactionCount(txFromAddress)
                expect(publicNonce).toEqual(0)
            })
        })

        test('send signed deploy transaction', async () => {

            // deploy a contract
            const unsignedTransaction: EeaTransactionRequest = {
                nonce: privateNonceNode3,
                gasPrice: 0,
                gasLimit: 3000000,
                // to: undefined,
                value: 0,
                data: '0x608060405234801561001057600080fd5b50336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550610221806100606000396000f300608060405260043610610057576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680633fa4f2451461005c5780636057361d1461008757806367e404ce146100b4575b600080fd5b34801561006857600080fd5b5061007161010b565b6040518082815260200191505060405180910390f35b34801561009357600080fd5b506100b260048036038101908080359060200190929190505050610115565b005b3480156100c057600080fd5b506100c96101cb565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6000600254905090565b7fc9db20adedc6cf2b5d25252b101ab03e124902a73fcb12b753f3d1aaa2d8f9f53382604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019250505060405180910390a18060028190555033600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b6000600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050905600a165627a7a723058208efaf938851fb2d235f8bf9a9685f149129a30fe0f4b20a6c1885dc02f639eba0029',
                chainId: 2018,
                privateFrom: node3,
                privateFor: testPrivacyGroupOptions.privateFor
            }

            const signedTransaction = await eeaWallet.signPrivateTransaction(unsignedTransaction)

            const tx = await providerNode3.sendPrivateTransaction(signedTransaction)
            expect(tx.hash).toMatch(utils.RegEx.transactionHash)
            txHash = tx.hash

            // wait for the transaction to be mined
            const txReceipt = await providerNode3.waitForTransaction(tx.hash)
            expect(txReceipt.status).toEqual(1)
            expect(txReceipt.contractAddress).toBeNull()
        }, 30000)

        describe('Post transaction count checks', () => {
            test('get private transaction count from node 3', async () => {
                privateNonceNode3 = await providerNode3.getPrivateTransactionCount(txFromAddress, testPrivacyGroupOptions)
                expect(privateNonceNode3).toBeGreaterThanOrEqual(1)
            })

            test('get private transaction count from node 2', async () => {
                privateNonceNode3 = await providerNode2.getPrivateTransactionCount(txFromAddress, testPrivacyGroupOptions)
                expect(privateNonceNode3).toBeGreaterThanOrEqual(0)
            })

            test('get private transaction count from node 1', async () => {
                privateNonceNode3 = await providerNode1.getPrivateTransactionCount(txFromAddress, testPrivacyGroupOptions)
                expect(privateNonceNode3).toBeGreaterThanOrEqual(1)
            })

            test('get public transaction count from node 3', async () => {
                publicNonce = await providerNode3.getTransactionCount(txFromAddress)
                expect(publicNonce).toEqual(0)
            })

            test('get public transaction count from node 2', async () => {
                publicNonce = await providerNode2.getTransactionCount(txFromAddress)
                expect(publicNonce).toEqual(0)
            })

            test('get public transaction count from node 1', async () => {
                publicNonce = await providerNode1.getTransactionCount(txFromAddress)
                expect(publicNonce).toEqual(0)
            })
        })

        describe('Get private transaction receipt', () => {
            test('from node 3', async() => {
                const txReceipt = await providerNode3.getPrivateTransactionReceipt(txHash)
                expect(txReceipt.contractAddress).toMatch(utils.RegEx.ethereumAddress)
                expect(txReceipt.from).toEqual('0x7E5F4552091A69125d5DfCb7b8C2659029395Bdf')
                expect(txReceipt.to).toBeUndefined()
            })

            test('from node 2', async() => {
                const txReceipt = await providerNode2.getPrivateTransactionReceipt(txHash)
                expect(txReceipt).toBeNull()
            })

            test('from node 1', async() => {
                const txReceipt = await providerNode1.getPrivateTransactionReceipt(txHash)
                expect(txReceipt.contractAddress).toMatch(utils.RegEx.ethereumAddress)
                expect(txReceipt.from).toEqual('0x7E5F4552091A69125d5DfCb7b8C2659029395Bdf')
                expect(txReceipt.to).toBeUndefined()
            })
        })
    })

    describe('private for only one other party', () => {
        describe.each`
        testDescription | privacyGroup | txOptions | txFromAddress
        ${'find count and receipt using privateFrom and privateFor'} | ${ {privateFrom: node1, privateFor: [node2]} } | ${ {privateFrom: node1, privateFor: [node2]} } | ${'0x2B5AD5c4795c026514f8317c7a215E218DcCD6cF'}
        ${'find count and receipt using privacy group id'} | ${ {privateFor: 'DyAOiF/ynpc+JXa2YAGB0bCitSlOMNm+ShmB/7M6C4w='} }  | ${ {privateFrom: node1, privateFor: [node2]} } | ${'0x2B5AD5c4795c026514f8317c7a215E218DcCD6cF'}
        ${'privateFor using privacyGroupId'} | ${ {privateFor: 'DyAOiF/ynpc+JXa2YAGB0bCitSlOMNm+ShmB/7M6C4w='} } | ${ {privateFrom: node1, privateFor: 'DyAOiF/ynpc+JXa2YAGB0bCitSlOMNm+ShmB/7M6C4w='} } | ${'0x2B5AD5c4795c026514f8317c7a215E218DcCD6cF'}
    `('$testDescription. Params: privacyGroup $privacyGroup, txOptions $txOptions and from $txFromAddress',
            ({testDescription, txFromAddress, privacyGroup, txOptions}) => {

                let eeaWallet: EeaWallet
                let privateNonce: number
                let publicNonce: number
                let publicTxHash: string
                let privateTxHash: string
                let unsignedTransaction: EeaTransactionRequest

                beforeAll(() => {
                    // 0x2B5AD5c4795c026514f8317c7a215E218DcCD6cF
                    const privateKey = '0x0000000000000000000000000000000000000000000000000000000000000002'
                    eeaWallet = new EeaWallet(privateKey)
                })

                test('Check privacy group', () => {
                    if (typeof privacyGroup === 'string') {
                        expect(generatePrivacyGroup(txOptions)).toEqual(privacyGroup)
                    }
                })

                test('get private transaction count from node1', async () => {
                    privateNonce = await providerNode1.getPrivateTransactionCount(txFromAddress, privacyGroup)
                    expect(privateNonce).toBeGreaterThanOrEqual(0)
                })

                test('get public transaction count from node1', async () => {
                    publicNonce = await providerNode1.getTransactionCount(txFromAddress)
                    expect(publicNonce).toEqual(0)
                })

                test('send signed deploy transaction', async () => {

                    // deploy a contract
                    unsignedTransaction = {
                        nonce: privateNonce,
                        gasPrice: 0,
                        gasLimit: 3000000,
                        // to: undefined,
                        value: 0,
                        data: '0x608060405234801561001057600080fd5b50336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550610221806100606000396000f300608060405260043610610057576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680633fa4f2451461005c5780636057361d1461008757806367e404ce146100b4575b600080fd5b34801561006857600080fd5b5061007161010b565b6040518082815260200191505060405180910390f35b34801561009357600080fd5b506100b260048036038101908080359060200190929190505050610115565b005b3480156100c057600080fd5b506100c96101cb565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6000600254905090565b7fc9db20adedc6cf2b5d25252b101ab03e124902a73fcb12b753f3d1aaa2d8f9f53382604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019250505060405180910390a18060028190555033600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b6000600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050905600a165627a7a723058208efaf938851fb2d235f8bf9a9685f149129a30fe0f4b20a6c1885dc02f639eba0029',
                        chainId: 2018,
                        ...txOptions
                    }

                    const signedTransaction = await eeaWallet.signPrivateTransaction(unsignedTransaction)

                    const tx = await providerNode1.sendPrivateTransaction(signedTransaction)
                    expect(tx.hash).toMatch(utils.RegEx.transactionHash)
                    publicTxHash = tx.hash
                    expect(tx.nonce).toEqual(unsignedTransaction.nonce)
                    expect(tx.data).toEqual(unsignedTransaction.data)
                    expect(tx.privateFor).toEqual(unsignedTransaction.privateFor)
                    expect(tx.privateFrom).toEqual(unsignedTransaction.privateFrom)
                    expect(tx.chainId).toEqual(unsignedTransaction.chainId)
                    // expect(tx.gasPrice).toEqual(unsignedTransaction.gasPrice)
                    // expect(tx.gasLimit).toEqual(unsignedTransaction.gasLimit)

                    // wait for the transaction to be mined
                    const txReceipt = await providerNode1.waitForTransaction(tx.hash)
                    expect(txReceipt.status).toEqual(1)
                    expect(txReceipt.contractAddress).toBeNull()
                }, 30000)

                test('get private transaction counts from each node', async () => {
                    const nonceNode1 = await providerNode1.getPrivateTransactionCount(txFromAddress, privacyGroup)
                    expect(nonceNode1).toBeGreaterThanOrEqual(privateNonce + 1)

                    const nonceNode2 = await providerNode2.getPrivateTransactionCount(txFromAddress, privacyGroup)
                    expect(nonceNode2).toBeGreaterThanOrEqual(privateNonce + 1)

                    const nonceNode3 = await providerNode3.getPrivateTransactionCount(txFromAddress, privacyGroup)
                    expect(nonceNode3).toBeGreaterThanOrEqual(publicNonce)
                })

                test('get public transaction count from each node', async () => {
                    const nonceNode1 = await providerNode1.getTransactionCount(txFromAddress)
                    expect(nonceNode1).toBeGreaterThanOrEqual(publicNonce)

                    const nonceNode2 = await providerNode2.getTransactionCount(txFromAddress)
                    expect(nonceNode2).toBeGreaterThanOrEqual(publicNonce)

                    const nonceNode3 = await providerNode3.getTransactionCount(txFromAddress)
                    expect(nonceNode3).toBeGreaterThanOrEqual(publicNonce)
                })

                test('get public transaction receipts from each node', async () => {
                    const txReceiptNode1 = await providerNode1.getTransactionReceipt(publicTxHash)
                    expect(txReceiptNode1.status).toEqual(1)
                    expect(txReceiptNode1.transactionHash).toEqual(publicTxHash)
                    expect(txReceiptNode1.contractAddress).toBeNull()

                    const txReceiptNode2 = await providerNode2.getTransactionReceipt(publicTxHash)
                    expect(txReceiptNode2.status).toEqual(1)
                    expect(txReceiptNode2.transactionHash).toEqual(publicTxHash)
                    expect(txReceiptNode2.contractAddress).toBeNull()

                    const txReceiptNode3 = await providerNode3.getTransactionReceipt(publicTxHash)
                    expect(txReceiptNode3.status).toEqual(1)
                    expect(txReceiptNode3.transactionHash).toEqual(publicTxHash)
                    expect(txReceiptNode3.contractAddress).toBeNull()
                })

                test('get private transaction receipts from each node', async () => {
                    const txReceiptNode1 = await providerNode1.getPrivateTransactionReceipt(publicTxHash)
                    expect(txReceiptNode1.contractAddress).toMatch(utils.RegEx.ethereumAddress)
                    expect(txReceiptNode1.from).toMatch(utils.RegEx.ethereumAddress)
                    expect(txReceiptNode1.to).toBeUndefined()

                    const txReceiptNode2 = await providerNode2.getPrivateTransactionReceipt(publicTxHash)
                    expect(txReceiptNode2.contractAddress).toMatch(utils.RegEx.ethereumAddress)
                    expect(txReceiptNode2.from).toMatch(utils.RegEx.ethereumAddress)
                    expect(txReceiptNode2.to).toBeUndefined()
                })

                test('try and get private transaction receipt from node not in transaction', async() => {
                    // TODO currently failing. Have raised https://pegasys1.atlassian.net/browse/PAN-2928
                    const txReceiptNode3 = await providerNode3.getPrivateTransactionReceipt(publicTxHash)
                    expect(txReceiptNode3).toBeNull()
                })

                test('get public transaction by hash', async () => {
                    const txNode1 = await providerNode1.getTransaction(publicTxHash)
                    const txNode2 = await providerNode2.getTransaction(publicTxHash)
                    const txNode3 = await providerNode3.getTransaction(publicTxHash)

                    privateTxHash = txNode1.data
                    expect(txNode1.data).toMatch(utils.RegEx.bytes32)
                    // TODO validate against node 1 public key
                    expect(txNode1.from).toMatch(utils.RegEx.ethereumAddress)

                    expect(txNode2.from).toMatch(utils.RegEx.ethereumAddress)
                    expect(txNode2.data).toMatch(txNode1.data)

                    expect(txNode3.from).toMatch(utils.RegEx.ethereumAddress)
                    expect(txNode3.data).toMatch(txNode1.data)
                })

                test('get private transaction by hash', async () => {
                    const txNode1 = await providerNode1.getPrivateTransaction(privateTxHash)
                    expect(txNode1.privateFrom).toEqual(txOptions.privateFrom)
                    expect(txNode1.privateFor).toEqual(txOptions.privateFor)

                    const txNode2 = await providerNode2.getPrivateTransaction(privateTxHash)
                    expect(txNode2.privateFrom).toEqual(txOptions.privateFrom)
                    expect(txNode2.privateFor).toEqual(txOptions.privateFor)

                    const txNode3 = await providerNode3.getPrivateTransaction(privateTxHash)
                    expect(txNode3).toEqual(null)
                })
            })
    })
})
