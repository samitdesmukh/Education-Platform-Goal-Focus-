import React from 'react';

export default function TutorAvatar({ tutor, size = 'md', className = '' }) {
  const sizes = {
    sm: 'w-10 h-10 text-lg',
    md: 'w-16 h-16 text-3xl',
    lg: 'w-20 h-20 text-4xl',
  };

  const image = tutor?.profilePicture || tutor?.image;
  const isImage =
    image &&
    (image.startsWith('data:') ||
      image.startsWith('http') ||
      image.startsWith('/'));

  if (isImage) {
    return (
      <img
        src={image}
        alt={tutor?.name || 'Tutor'}
        className={`${sizes[size]} rounded-full object-cover border-2 border-white shadow ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizes[size]} rounded-full bg-blue-100 flex items-center justify-center border-2 border-white shadow ${className}`}
    >
      {image && !isImage ? image : '👨‍🏫'}
    </div>
  );
}
