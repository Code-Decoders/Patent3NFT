pragma solidity ^0.5.6;
pragma experimental ABIEncoderV2;

import "./TRC721.sol";
import "./TRC721Metadata.sol";

contract NFTPatent is TRC721, TRC721Metadata {
    using Counters for Counters.Counter;
    Counters.Counter totalItems; // Total number of NFTS Items
    uint256 public minimumListingPrice = 1 trx;
    address owner;

    mapping(uint256 => Patent) private tokenIdToPatent; // mapping of int to struct
    mapping(string => uint256) private categories;
    mapping(address => uint256) public balances;

    struct Patent {
        uint256 tokenId;
        string tokenURI;
        string category;
        address owner;
        address payable currentBider;
        uint256 price;
    }

    constructor() public TRC721Metadata("NFTPatent", "NFTP") {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only Owner can call this function");
        _;
    }

    function setMinimumListingPrice(uint256 _price) public onlyOwner {
        minimumListingPrice = _price;
    }

    function mint(string memory _tokenURI, string memory _category) public {
        totalItems.increment();
        uint256 newItemId = totalItems.current();
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, _tokenURI);
        tokenIdToPatent[totalItems.current()] = Patent(
            totalItems.current(),
            _tokenURI,
            _category,
            msg.sender,
            address(0),
            minimumListingPrice
        );
        categories[_category] += 1;
        balances[msg.sender] += 1;
    }

    function getAll() public view returns (Patent[] memory) {
        uint256 _totalItems = totalItems.current();
        uint256 currentIndex = 0;

        Patent[] memory items = new Patent[](_totalItems);
        for (uint256 i = 0; i < totalItems.current(); i++) {
            uint256 currentId = i + 1;
            Patent storage currentItem = tokenIdToPatent[currentId];
            items[currentIndex] = currentItem;
            currentIndex += 1;
        }
        return items;
    }

    function getFromCategory(string memory _category)
        public
        view
        returns (Patent[] memory)
    {
        uint256 _totalItems = categories[_category];
        uint256 currentIndex = 0;
        Patent[] memory items = new Patent[](_totalItems);
        for (uint256 i = 0; i < totalItems.current(); i++) {
            uint256 currentId = i + 1;
            if (
                keccak256(
                    abi.encodePacked(tokenIdToPatent[currentId].category)
                ) == keccak256(abi.encodePacked((_category)))
            ) {
                Patent storage currentItem = tokenIdToPatent[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    function getFromAddress(address _user)
        public
        view
        returns (Patent[] memory)
    {
        require(
            address(this) != _user,
            "User shouldnot be the contract address"
        );
        uint256 currentIndex = 0;
        uint256 _totalItems = balances[_user];
        Patent[] memory items = new Patent[](_totalItems);

        for (uint256 i = 0; i < totalItems.current(); i++) {
            if (tokenIdToPatent[i + 1].owner == _user) {
                Patent storage currentItem = tokenIdToPatent[currentIndex];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }

        return items;
    }

    function getFromTokenId(uint256 _tokenid)
        public
        view
        returns (Patent memory)
    {
        require(
            _tokenid > 0 && _tokenid <= totalItems.current(),
            "Token Id doesnt exist"
        );
        return tokenIdToPatent[_tokenid];
    }

    function makeOffer(uint256 _tokenId) public payable {
        require(
            _tokenId > 0 && _tokenId <= totalItems.current(),
            "Token Id doesnt exist"
        );
        require(
            msg.value > tokenIdToPatent[_tokenId].price,
            "Bid is not enough"
        );
        if (tokenIdToPatent[_tokenId].currentBider != address(0)) {
            tokenIdToPatent[_tokenId].currentBider.send(
                tokenIdToPatent[_tokenId].price
            );
        }
        tokenIdToPatent[_tokenId].currentBider = msg.sender;
        tokenIdToPatent[_tokenId].price = msg.value;
    }

    function cancelOffer(uint256 _tokenId) public {
        require(
            _tokenId > 0 && _tokenId <= totalItems.current(),
            "Token Id doesnt exist"
        );
        require(
            msg.sender == tokenIdToPatent[_tokenId].currentBider ||
                msg.sender == tokenIdToPatent[_tokenId].owner,
            "Only currentBider and owner can cancel the offer"
        );
        tokenIdToPatent[_tokenId].currentBider.send(
            tokenIdToPatent[_tokenId].price
        );
        tokenIdToPatent[_tokenId].currentBider = address(0);
        tokenIdToPatent[_tokenId].price = minimumListingPrice;
    }

    function approveOffer(uint256 _tokenId) public {
        require(
            _tokenId > 0 && _tokenId <= totalItems.current(),
            "Token Id doesnt exist"
        );
        require(
            msg.sender == tokenIdToPatent[_tokenId].owner,
            "Only Owner can approve and sell the NFT"
        );
        tokenIdToPatent[_tokenId].owner = tokenIdToPatent[_tokenId]
            .currentBider;
        _transferFrom(msg.sender, tokenIdToPatent[_tokenId].owner, _tokenId);
        msg.sender.send(tokenIdToPatent[_tokenId].price);
        tokenIdToPatent[_tokenId].currentBider = address(0);
        tokenIdToPatent[_tokenId].price = minimumListingPrice;
        balances[msg.sender] -= 1;
        balances[tokenIdToPatent[_tokenId].owner] += 1;
    }
}
