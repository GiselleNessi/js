export const constructorParamsWithTuplesMetadata = {
  compiler: {
    version: "0.8.13+commit.abaa5c0e",
  },
  language: "Solidity",
  output: {
    abi: [
      {
        inputs: [
          {
            internalType: "bytes32",
            name: "uri",
            type: "bytes32",
          },
          {
            internalType: "uint256",
            name: "someId",
            type: "uint256",
          },
          {
            internalType: "bytes[]",
            name: "anArray",
            type: "bytes[]",
          },
          {
            components: [
              {
                internalType: "uint256",
                name: "aNumber",
                type: "uint256",
              },
              {
                internalType: "bytes32",
                name: "aString",
                type: "bytes32",
              },
              {
                internalType: "address[]",
                name: "anArray",
                type: "address[]",
              },
            ],
            internalType: "struct ConstructorParams.Foo",
            name: "aStruct",
            type: "tuple",
          },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
      },
      {
        inputs: [],
        name: "contractUri",
        outputs: [
          {
            internalType: "bytes32",
            name: "",
            type: "bytes32",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "foo",
        outputs: [
          {
            internalType: "uint256",
            name: "aNumber",
            type: "uint256",
          },
          {
            internalType: "bytes32",
            name: "aString",
            type: "bytes32",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            components: [
              {
                internalType: "uint256",
                name: "aNumber",
                type: "uint256",
              },
              {
                internalType: "bytes32",
                name: "aString",
                type: "bytes32",
              },
              {
                internalType: "address[]",
                name: "anArray",
                type: "address[]",
              },
            ],
            internalType: "struct ConstructorParams.Foo",
            name: "aStruct",
            type: "tuple",
          },
        ],
        name: "updateStruct",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
    devdoc: {
      kind: "dev",
      methods: {},
      version: 1,
    },
    userdoc: {
      kind: "user",
      methods: {},
      version: 1,
    },
  },
  settings: {
    compilationTarget: {
      "contracts/ConstructorParams.sol": "ConstructorParams",
    },
    evmVersion: "london",
    libraries: {},
    metadata: {
      bytecodeHash: "ipfs",
    },
    optimizer: {
      enabled: true,
      runs: 200,
    },
    remappings: [],
  },
  sources: {
    "contracts/ConstructorParams.sol": {
      keccak256:
        "0x1856f33b89573df9f7e75c5ba9a977a9a5e234ad78b25117e2a2266c968025d5",
      license: "MIT",
      urls: [
        "bzz-raw://31c8a78d6c71b604a04445f8362e5f58511dffb86b3658ad8c9514e2c4f7cb2a",
        "dweb:/ipfs/QmbU8BtJJRUgJ8CFmwbiurs6fWBjboA3uttRqQmg4D8P5w",
      ],
    },
  },
  version: 1,
};

export const constructorParamsWithTuplesBytecode =
  "0x60a060405234801561001057600080fd5b5060405161083838038061083883398101604081905261002f91610380565b60808490526000839055805160029081556020808301516003556040830151805184939261006292600492910190610082565b50508251610078915060019060208501906100e7565b5050505050610517565b8280548282559060005260206000209081019282156100d7579160200282015b828111156100d757825182546001600160a01b0319166001600160a01b039091161782556020909201916001909101906100a2565b506100e3929150610140565b5090565b828054828255906000526020600020908101928215610134579160200282015b828111156101345782518051610124918491602090910190610155565b5091602001919060010190610107565b506100e39291506101c9565b5b808211156100e35760008155600101610141565b828054610161906104dd565b90600052602060002090601f01602090048101928261018357600085556100d7565b82601f1061019c57805160ff19168380011785556100d7565b828001600101855582156100d7579182015b828111156100d75782518255916020019190600101906101ae565b808211156100e35760006101dd82826101e6565b506001016101c9565b5080546101f2906104dd565b6000825580601f10610202575050565b601f0160209004906000526020600020908101906102209190610140565b50565b634e487b7160e01b600052604160045260246000fd5b604051606081016001600160401b038111828210171561025b5761025b610223565b60405290565b604051601f8201601f191681016001600160401b038111828210171561028957610289610223565b604052919050565b60006001600160401b038211156102aa576102aa610223565b5060051b60200190565b6000606082840312156102c657600080fd5b6102ce610239565b82518152602080840151818301526040840151919250906001600160401b038111156102f957600080fd5b8301601f8101851361030a57600080fd5b805161031d61031882610291565b610261565b81815260059190911b8201830190838101908783111561033c57600080fd5b928401925b828410156103705783516001600160a01b03811681146103615760008081fd5b82529284019290840190610341565b6040860152509295945050505050565b6000806000806080858703121561039657600080fd5b845160208087015160408801519296509450906001600160401b03808211156103be57600080fd5b818801915088601f8301126103d257600080fd5b81516103e061031882610291565b81815260059190911b8301840190848101908b8311156103ff57600080fd5b8585015b838110156104a95780518581111561041b5760008081fd5b8601603f81018e1361042d5760008081fd5b878101518681111561044157610441610223565b610453601f8201601f19168a01610261565b8181528f60408385010111156104695760008081fd5b60005b8281101561048857838101604001518282018c01528a0161046c565b828111156104995760008b84840101525b5085525050918601918601610403565b5060608b015190975094505050808311156104c357600080fd5b50506104d1878288016102b4565b91505092959194509250565b600181811c908216806104f157607f821691505b60208210810361051157634e487b7160e01b600052602260045260246000fd5b50919050565b6080516103076105316000396000606001526103076000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c80634c77369014610046578063c0e24d5e1461005b578063c298557814610095575b600080fd5b6100596100543660046101d1565b6100b8565b005b6100827f000000000000000000000000000000000000000000000000000000000000000081565b6040519081526020015b60405180910390f35b6002546003546100a3919082565b6040805192835260208301919091520161008c565b80516002908155602080830151600355604083015180518493926100e1926004929101906100e7565b50505050565b82805482825590600052602060002090810192821561013c579160200282015b8281111561013c57825182546001600160a01b0319166001600160a01b03909116178255602090920191600190910190610107565b5061014892915061014c565b5090565b5b80821115610148576000815560010161014d565b634e487b7160e01b600052604160045260246000fd5b6040516060810167ffffffffffffffff8111828210171561019a5761019a610161565b60405290565b604051601f8201601f1916810167ffffffffffffffff811182821017156101c9576101c9610161565b604052919050565b600060208083850312156101e457600080fd5b823567ffffffffffffffff808211156101fc57600080fd5b908401906060828703121561021057600080fd5b610218610177565b82358152838301358482015260408301358281111561023657600080fd5b80840193505086601f84011261024b57600080fd5b82358281111561025d5761025d610161565b8060051b925061026e8584016101a0565b818152928401850192858101908985111561028857600080fd5b948601945b848610156102bf57853592506001600160a01b03831683146102af5760008081fd5b828252948601949086019061028d565b6040840152509097965050505050505056fea2646970667358221220e452678ebffb2e917f8b77546e364d2eadd6f870a5c2b49f130d1fb164cede2f64736f6c634300080d0033";