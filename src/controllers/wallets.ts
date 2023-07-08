import { RequestHandler } from "express";
import createHttpError from "http-errors";
import Wallets from "../models/wallets";
import Accounts from "../models/accounts";
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

        // Add Wallet to Account
        if(WalletAccount) {
            const account = await Accounts.findById(WalletAccount);
            if(!account) {
                throw createHttpError(404, "Account not found");
            }
            account.AccountWallets.push(wallet._id);
            await account.save();
        }

        // Save Wallet
        await wallet.save();

        // Return Wallet
        res.status(201).json(wallet);
    }
    catch (error) {
        next(error);
    }
}

/**
 * @route GET /wallets/:WalletId
 * @description Get a wallet by id
 * @access Private
 */
interface GetWalletParams {
    WalletId?: string;
}
export const getWallet: RequestHandler<
    GetWalletParams,
    unknown,
    unknown,
    unknown
> = async (req, res, next) => {
    const { WalletId } = req.params;
    try {
        // Check if wallet is valid
        if(WalletId && !mongoose.Types.ObjectId.isValid(WalletId)) {
            throw createHttpError(400, "Invalid Wallet Id");
        }
        // Get Wallet
        const wallet = await Wallets.findById(WalletId);
        if(!wallet) {
            // If wallet not found, throw 404 error
            throw createHttpError(404, "Wallet not found");
        }
        res.status(200).json(wallet);
    }   
    catch (error) {
        next(error);
    }
}

/**
 * @route PUT /wallets/:WalletId
 * @description Update a wallet by id
 * @access Private
 */
interface UpdateWalletParams {
    WalletId?: string;
}
interface UpdateWalletBody {
    WalletAccount?: Types.ObjectId;
    WalletName?: string;
    WalletDescription?: string;
    WalletBalance?: number;
}
export const updateWallet: RequestHandler<
    UpdateWalletParams,
    unknown,
    UpdateWalletBody,
    unknown
> = async (req, res, next) => {
    try {
        const { WalletId } = req.params;
        const { WalletAccount, WalletName, WalletDescription, WalletBalance } = req.body;
        // Check if wallet is valid
        if(WalletId && !mongoose.Types.ObjectId.isValid(WalletId)) {   
            throw createHttpError(400, "Invalid Wallet Id");
        }
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
        // Update Wallet
        const wallet = await Wallets.findByIdAndUpdate(
            WalletId,
            {
                WalletAccount,
                WalletName,
                WalletDescription,
                WalletBalance,
            },
            { new: true }
        );
        if(!wallet) {
            // If wallet not found, throw 404 error
            throw createHttpError(404, "Wallet not found");
        }
        res.status(200).json(wallet);
    }
    catch(error) {
        next(error);
    }
}

/**
 * @route DELETE /wallets/:WalletId
 * @description Delete a wallet by id
 * @access Private
 */
interface DeleteWalletParams {
    WalletId?: string;
}
export const deleteWallet: RequestHandler<
    DeleteWalletParams,
    unknown,
    unknown,
    unknown
> = async (req, res, next) => {
    try {
        const { WalletId } = req.params;
        // Check if wallet is valid
        if(WalletId && !mongoose.Types.ObjectId.isValid(WalletId)) {
            throw createHttpError(400, "Invalid Wallet Id");
        }
        // Check if wallet exists
        const walletExists = await Wallets.findById(WalletId);
        if(!walletExists) {
            // If wallet not found, throw 404 error
            throw createHttpError(404, "Wallet not found");
        }
        // Delete Wallet
        const wallet = await Wallets.findByIdAndDelete(WalletId);
        if(!wallet) {
            // If wallet not found, throw 404 error
            throw createHttpError(404, "Wallet not found");
        }
        res.status(200).json(wallet);
    } catch (error) {
        next(error);
    }
}