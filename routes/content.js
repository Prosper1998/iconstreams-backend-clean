const express = require('express');
const Content = require('../models/content');
const User = require('../models/User');
const { auth, adminAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { uploadToBunny } = require('../config/bunny');

const router = express.Router();

// Get all content
router.get('/', async (req, res) => {
  try {
    const content = await Content.find();
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new content
router.post('/', auth, adminAuth, upload, async (req, res) => {
  try {
    const { title, category, description, status, visibility, tags, publishDate, releaseYear, duration } = req.body;
    const files = req.files;

    let thumbnailUrl = '';
    let videoUrl = '';

    if (files?.thumbnail) {
      const thumbnail = files.thumbnail[0];
      const result = await uploadToBunny(thumbnail.buffer, `${Date.now()}-${thumbnail.originalname}`, 'thumbnails/');
      if (!result.success) throw result.error;
      thumbnailUrl = result.url;
    }

    if (files?.video) {
      const video = files.video[0];
      const result = await uploadToBunny(video.buffer, `${Date.now()}-${video.originalname}`, 'videos/');
      if (!result.success) throw result.error;
      videoUrl = result.url;
    }

    const content = new Content({
      title,
      category,
      description,
      thumbnail: thumbnailUrl,
      video: videoUrl,
      status,
      visibility,
      tags: Array.isArray(tags) ? tags : String(tags).split(',').map(t => t.trim()),
      publishDate: publishDate || Date.now(),
      releaseYear,
      duration,
    });

    await content.save();
    return res.status(201).json({ message: 'Content uploaded successfully', content });
  } catch (error) {
    console.error('❌ Content Upload Error:', error);
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
});

// Add new content (direct)
router.post('/direct', auth, adminAuth, upload, async (req, res) => {
  try {
    const { title, category, description, status, visibility, tags, publishDate, releaseYear, duration } = req.body;
    const files = req.files;

    let thumbnailUrl = '';
    let videoUrl = '';

    if (files?.thumbnail) {
      const thumbnail = files.thumbnail[0];
      const result = await uploadToBunny(thumbnail.buffer, `${Date.now()}-${thumbnail.originalname}`, 'thumbnails/');
      if (!result.success) throw result.error;
      thumbnailUrl = result.url;
    }

    if (files?.video) {
      const video = files.video[0];
      const result = await uploadToBunny(video.buffer, `${Date.now()}-${video.originalname}`, 'videos/');
      if (!result.success) throw result.error;
      videoUrl = result.url;
    }

    const content = new Content({
      title,
      category,
      description,
      thumbnail: thumbnailUrl,
      video: videoUrl,
      status,
      visibility,
      tags: Array.isArray(tags) ? tags : String(tags).split(',').map(t => t.trim()),
      publishDate: publishDate || Date.now(),
      releaseYear,
      duration,
    });

    await content.save();
    return res.status(201).json({ message: 'Content uploaded successfully', content });
  } catch (error) {
    console.error('❌ Direct Content Upload Error:', error);
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
});

// Update content
router.put('/:id', auth, adminAuth, upload, async (req, res) => {
  const { title, category, description, status, visibility, tags, publishDate, releaseYear, duration } = req.body;
  const files = req.files;

  try {
    const content = await Content.findById(req.params.id);
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    if (files?.thumbnail) {
      const thumbnail = files.thumbnail[0];
      const result = await uploadToBunny(thumbnail.buffer, `${Date.now()}-${thumbnail.originalname}`, 'thumbnails/');
      if (!result.success) throw result.error;
      content.thumbnail = result.url;
    }

    if (files?.video) {
      const video = files.video[0];
      const result = await uploadToBunny(video.buffer, `${Date.now()}-${video.originalname}`, 'videos/');
      if (!result.success) throw result.error;
      content.video = result.url;
    }

    content.title = title || content.title;
    content.category = category || content.category;
    content.description = description || content.description;
    content.status = status || content.status;
    content.visibility = visibility || content.visibility;
    content.tags = tags ? (Array.isArray(tags) ? tags : String(tags).split(',').map(t => t.trim())) : content.tags;
    content.publishDate = publishDate || content.publishDate;
    content.releaseYear = releaseYear || content.releaseYear;
    content.duration = duration || content.duration;

    await content.save();
    res.json({ message: 'Content updated successfully', content });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
