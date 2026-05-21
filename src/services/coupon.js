const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createCpn = async(cpn)=>{
    const code = cpn.code;
    const existingCoupon = await prisma.coupon.findUnique({
            where: { code }
        });

        if (existingCoupon) {
            return {error:"A coupon with this code already exists"};
        }

        const coupon = await prisma.coupon.create({
            data: cpn
        });

        return coupon;

};
const getAllCpns = async ()=>{
    const coupons = await prisma.coupon.findMany();
    return coupons;
};
const getCpn = async(id)=>{
    const coupon = await prisma.coupon.findUnique({ where: { id } });

    if (!coupon) {
      return {error:"Coupon not found"}
    }

    return coupon;
};
const updateCpn = async(id,updatedCpn)=>{
    const coupon = await prisma.coupon.findUnique({ where: { id } });
    if (!coupon) {
     return {error:"Coupon not found"}
    }
      const updatedCoupon = await prisma.coupon.update({
      where: { id },
      data: updatedCpn
    });

    return updatedCoupon;

};
const deleteCpn = async(id)=>{
    const coupon = await prisma.coupon.findUnique({ where: { id } });
    if (!coupon) {
      return {error:"Coupon not found"}
    }


    const deltedCpn = await prisma.coupon.delete({ where: { id } });
    return deltedCpn;
};
module.exports={
    createCpn,
    getAllCpns,
    getCpn,
    updateCpn,
    deleteCpn

}