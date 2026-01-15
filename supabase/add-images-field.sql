-- Migration: Add images array field to recipes table
-- Date: 2024
-- Description: Adds support for multiple images per recipe while maintaining backward compatibility

-- Add images column as TEXT array (nullable, defaults to NULL)
ALTER TABLE recipes 
ADD COLUMN IF NOT EXISTS images TEXT[];

-- Create index on images array for better query performance
CREATE INDEX IF NOT EXISTS idx_recipes_images ON recipes USING GIN (images);

-- Optional: Migrate existing image_url values to images array
-- This will populate images array with existing image_url values for backward compatibility
UPDATE recipes 
SET images = ARRAY[image_url]::TEXT[]
WHERE image_url IS NOT NULL 
  AND (images IS NULL OR array_length(images, 1) IS NULL);

-- Add comment to column for documentation
COMMENT ON COLUMN recipes.images IS 'Array of image URLs for the recipe. First image is also stored in image_url for backward compatibility.';

