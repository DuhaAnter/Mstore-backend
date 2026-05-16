const CpnService = require('../services/coupon.js');

const createCpn = async (req, res) => {
    try {
        const cpn = req.body;
        const result = await CpnService.createCpn(cpn);
        if (result.error) {
            return res.status(400).json({ message: result.error })
        }

        return res.status(201).json({
            message: "Coupon created successfully.", data: result
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "failed to create coupon"
        })
    }
};
const updateCpn = async (req, res) => {
    try {
        const id = req.params.id;
        const updatedCpn = req.body;
        const result = await CpnService.updateCpn(id, updatedCpn);
        if (result.error1) {
            return res.status(404).json({ message: result.error1 });
        }
        if (result.error2) {
            res.status(400).json({ message: result.error2 });
        }

        return res.status(200).json({ message: "Coupon updated successfully.", data: result });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "failed to update coupon"
        })
    }

};
const deleteCpn = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await CpnService.deleteCpn(id);
        if (result.error) {
            return res.status(404).json({ message: result.error });
        }
         return res.status(200).json({ message: "Coupon deleted successfully.", data: result });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "failed to delete coupon"
        })
    }

};
const getCpn = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await CpnService.getCpn(id);
        if (result.error) {
            return res.status(404).json({ message: result.error });
        }
        return res.status(200).json({ message: "coupon retrived successfully", data: coupon });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "failed to get coupon"
        })
    }

};
const getAllCpns = async (req, res) => {
    try {

        const all = await CpnService.getAllCpns();
        return res.status(200).json({ message: "coupons retrived successfully", data: all });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "failed to get all coupon"
        })
    }

};

module.exports = {
    createCpn,
    updateCpn,
    deleteCpn,
    getCpn,
    getAllCpns
};