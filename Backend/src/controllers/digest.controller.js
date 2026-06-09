import Digest from '../models/Digest.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getLatestDigest = asyncHandler(async (req, res) => {
  const digest = await Digest.findOne({ userId: req.user._id }).sort({ createdAt: -1 });
  
  let wasUpdated = false;
  if (digest && !digest.isRead) {
    digest.isRead = true;
    await digest.save();
    wasUpdated = true;
  }

  res.status(200).json({
    success: true,
    digest,
    wasMarkedRead: wasUpdated
  });
});

export const dismissDigest = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const digest = await Digest.findOneAndUpdate(
    { _id: id, userId: req.user._id },
    { isDismissed: true, isRead: true },
    { new: true }
  );

  if (!digest) {
    return res.status(404).json({
      success: false,
      message: 'Digest not found'
    });
  }

  res.status(200).json({
    success: true,
    message: 'Digest dismissed successfully',
    digest
  });
});

export const getAllDigests = asyncHandler(async (req, res) => {
  const digests = await Digest.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    digests
  });
});
