const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

exports.isVariantMine = () => {
    return async (req, res, next) => {

        const productId = req.params.id;
        const variantId = req.params.variantId;

        if (!productId || !variantId) {
            return res.status(400).json({ message: "Missing product ID or variant ID in URL parameters" });
        }

        try {
            //Existence Check
            const variantExist = await prisma.variant.findUnique({
                where: { id: variantId }
            });
            
            if (!variantExist) {
                return res.status(404).json({ message: "Variant not found" });
            }
            //Ownership Check
            if (variantExist.productId !== productId) {
                return res.status(403).json({ message: "This variant does not belong to the specified product" });
            }
            //if both check pass proceed
            req.variant = variantExist;
            next();
            
        } catch (error) {
            console.log("error in middleware:", error);
            return res.status(500).json({ message: "failed from middlware" });
        }
    }
};