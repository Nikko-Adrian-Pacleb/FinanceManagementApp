import { RequestHandler } from "express";
import createHttpError from "http-errors";
import Wallets from "../models/wallets";
import mongoose, { Types } from "mongoose";

/**
 * @route GET /wallets
 * @description Get all wallets
 * @access Private
 */
export const getWallets: RequestHandler = async (req, res, next) => {
    try {
        const wallets = await Wallets.find().sort({ WalletName: 1 });
        res.status(200).json(wallets);
    }
    catch (error) {
        next(error);
    }
}

/**
 * @route POST /wallets
 * @description Add a new wallet
 * @access Private
*/
interface CreateWalletBody {
    WalletAccount?: Types.ObjectId;
    WalletName?: string;
    WalletDescription?: string;
    WalletBalance?: number;
}
export const createWallet: RequestHandler<
    unknown,
    unknown,
    CreateWalletBody,
    unknown
> = async (req, res, next) => {
    const {
        WalletAccount,
        WalletName,
        WalletDescription,
        WalletBalance,
    } = req.body;
    try {
        // Validate Fields
        if(WalletAccount && !mongoose.Types.ObjectId.isValid(WalletAccount)) {
            throw createHttpError(400, "Invalid Wallet Account");
        }
        if(!WalletName) {
            throw createHttpError(400, "Wallet Name is required");
        }
        if(!WalletBalance) {
            throw createHttpError(400, "Wallet Balance is required");
        }
        // Create Wallet
        const wallet = new Wallets({
            WalletAccount,
            WalletName,
            WalletDescription,
            WalletBalance,
        });

        // Save Wallet
        await wallet.save();

        // Return Wallet
        res.status(201).json(wallet);
    }
    catch (error) {
        next(error);
    }
}