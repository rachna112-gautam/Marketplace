pragma solidity >=0.5.0;

contract Marketplace{
    string public name;

    struct Product {
        uint id;
        string pname;
        uint price;
        address payable owner;
        bool purchased;
    }

    mapping(uint => Product) public products;

    uint public productCnt = 0;
    constructor() public {
        name = 'rachna gautam marketplace';
    }



    event ProductCreated(
        uint id,
        string pname,
        uint price,
        address payable owner,
        bool purchased
    );


    event ProductPurchased(
        uint id,
        string pname,
        uint price,
        address payable owner,
        bool purchased
    );

    function createProduct(string memory _name, uint _price) public{
          //require a vaid name
          require(bytes(_name).length > 0);

          //require valid price
          require(_price > 0);
          //require product count


          productCnt++;
          products[productCnt] = Product(productCnt, _name, _price, msg.sender, false);

       emit ProductCreated(productCnt, _name, _price, msg.sender, false);
    }

  function purchaseProduct(uint _id) public payable{
      //fetch the product
    Product memory _product = products[_id];
      //fetch the owner
    address payable _seller = _product.owner;
      //make sure the product is valid
      require(_product.id > 0 && _product.id <= productCnt);


     //require that there is enough ether
     require(msg.value >= _product.price);

     //require that the product has not been purchased already
     require(!_product.purchased);
     //require that the buyer is not seller
     require(_seller != msg.sender);
     //transfer ownership to buyer
     _product.owner = msg.sender;

      //purchase it
     _product.purchased = true;

      //update the products
      products[_id] = _product;

      //pay the seller by sending the ethers
     address(uint16(_seller)).transfer(msg.value);
      //trigger on event
     emit ProductPurchased(productCnt, _product.pname, _product.price, msg.sender, true);
  }




}