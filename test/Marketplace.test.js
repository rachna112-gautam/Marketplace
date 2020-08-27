const { assert } = require("chai");

require('chai').use(require('chai-as-promised')).should()

const Marketplace  =  artifacts.require('./Marketplace.sol');

contract('Marketplace', ([deployer, seller, buyer]) => {
    let marketPlace;

    before(async() => {
        marketPlace = await Marketplace.deployed()
    })

    describe('deployment', async () => {
        it('deployed successfully', async () => {
            const address = await marketPlace.address;
            assert.notEqual(address, 0x0);
        })

        it('has a name', async () => {
            const name = await marketPlace.name();
            assert.equal(name, 'rachna gautam marketplace');
        })
    })



    describe('products', async () => {
let res, productCount;
        before(async() => {
           res = await marketPlace.createProduct('BMW', web3.utils.toWei('1', 'Ether'), { from: seller });
           productCount = await marketPlace.productCnt();
        })



        it('creates product', async () => {
            //success
            assert.equal(productCount, 1);
            const event = res.logs[0].args;
            assert.equal(event.id.toNumber(), productCount.toNumber(), 'id is correct');
            assert.equal(event.price, 1000000000000000000, 'price is correct');
            assert.equal(event.purchased, false, 'purchased is correct');
            assert.equal(event.owner, seller, 'owner is correct');
            assert.equal(event.pname, 'BMW', 'name is correct');

             //failure
             await marketPlace.createProduct('', web3.utils.toWei('1', 'Ether'), { from: seller }).should.be.rejected;
             await marketPlace.createProduct('', web3.utils.toWei('0', 'Ether'), { from: seller }).should.be.rejected;

        })



        it('lists products', async () => {
            const product = await marketPlace.products(productCount);
            assert.equal(product.id.toNumber(), productCount.toNumber(), 'id is correct');
            assert.equal(product.price, 1000000000000000000, 'price is correct');
            assert.equal(product.purchased, false, 'purchased is correct');
            assert.equal(product.owner, seller, 'owner is correct');
            assert.equal(product.pname, 'BMW', 'name is correct');


        })


        it('sells products', async () => {
           //track balance before purchase
           let oldbal = await web3.eth.getBalance(seller);
           oldbal = new web3.utils.BN(oldbal);
            //success
        res = await marketPlace.purchaseProduct(productCount, { from: buyer, value: web3.utils.toWei('1','Ether')})

          //checking logs
        const event = res.logs[0].args;
        assert.equal(event.id.toNumber(), productCount.toNumber(), 'id is correct');
        assert.equal(event.price, 1000000000000000000, 'price is correct');
        assert.equal(event.purchased, true, 'purchased is correct');
        assert.equal(event.owner, buyer, 'owner is correct');
        assert.equal(event.pname, 'BMW', 'name is correct');


        //check that seller received funds
          let newbal = await web3.eth.getBalance(seller);
          newbal = new web3.utils.BN(newbal);


          let price = web3.utils.toWei('1', 'Ether');
          price = new web3.utils.BN(price);

          //const expectedBal = oldbal.add(price);
          //assert.equal(newbal.toString(), expectedBal.toString());


          //failure

          //product doesnot exists
          await marketPlace.purchaseProduct(99, { from: buyer, value: web3.utils.toWei('1','ether') }).should.be.rejected;
          //buyer tries to purchase it without enough ether
          await marketPlace.purchaseProduct(productCount, { from: buyer, value: web3.utils.toWei('0.5', 'ether')}).should.be.rejected;
          //product can be purchased twice
          await marketPlace.purchaseProduct(productCount, { from: deployer, value: web3.utils.toWei('1', 'ether')}).should.be.rejected;
          //Buyer can't be seller
          await marketPlace.purchaseProduct(productCount, { from: buyer, value: web3.utils.toWei('1', 'ether')}).should.be.rejected;

        })
    })
})