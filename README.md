![QuickEdit banner](https://github.com/user-attachments/assets/b32dc096-b321-4327-bc9e-2d27508ff007)

# QuickEdit: AI-Powered Online Image & Video Editor

QuickEdit is an AI-powered online image and video editor built using the Cloudinary AI API. It offers robust features for both images and videos, with user-friendly authentication and a tiered credit system. Enhance your media editing experience with cutting-edge AI tools!

## Table of Contents

- [Demo](#demo)
- [Screenshots](#screenshots)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Packages Used](#packages-used)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [Folder Structure](#folder-structure)
- [Running the Application](#running-the-application)
- [Author](#author)
- [Documentation](#documentation)

## Demo

[Click here!](https://quick-edit-app.vercel.app) to view the live deployment.

## Screenshots

### Image Editing

![Image Editing Screenshot](https://github.com/user-attachments/assets/54f56b99-178f-4292-b0b3-eda3e5784314)

### Video Editing

![Video Editing Screenshot](https://github.com/user-attachments/assets/c02c02d2-c28d-4add-b59e-8a1168f1f3d0)

## Features

### Image Editing Features

- **Background Removal**: Remove backgrounds from images seamlessly.
- **AI Object Removal**: Delete unwanted objects from images intelligently.
- **AI Background Replace**: Replace backgrounds with AI-generated alternatives.
- **Generative Image Fill**: Fill image areas with AI-generated content.
- **AI Object Extract**: Extract objects from images with precision.
- **Export in Multiple Sizes**: Save edited images in various resolutions.

### Video Editing Features

- **AI Video Transcription**: Automatically transcribe video content.
- **Smart Video Crop**: Intelligently crop videos to desired dimensions.
- **Export in Multiple Sizes**: Save edited videos in various resolutions.

### User Features

- **Authentication**: Secure user authentication with Google using Auth.js.
- **Credits System**:
  - **Free Tier**: 20 credits available for basic usage.
  - **Premium Tier**: Unlimited credits for advanced editing needs.
- **Responsive Design**: Optimized for all devices, providing a seamless experience across desktops, tablets, and smartphones.

## Technologies Used

- **Next.js**: Framework for server-side rendering and API routes.
- **TailwindCSS**: Utility-first CSS framework for styling.
- **Cloudinary AI API**: Advanced image and video processing capabilities.
- **Prisma**: ORM for database management.
- **MongoDB**: NoSQL database for scalable data storage.
- **Framer Motion**: For creating smooth animations.
- **Auth.js**: OAuth integration for user authentication with Google.
- **Zustand**: Lightweight state management for React applications.

## Packages Used

- **UI/UX**: `@radix-ui/react-checkbox`, `@radix-ui/react-dialog`, `@radix-ui/react-tooltip`, `framer-motion`, `lucide-react`
- **Forms**: `react-hook-form`
- **Database**: `@prisma/client`, `prisma`
- **Cloudinary**: `cloudinary`
- **State Management**: `zustand`
- **Miscellaneous**: `clsx`, `sonner`, `react-dropzone`, `tailwind-merge`, `tailwindcss-animate`, `zod`

## Environment Variables

Create a `.env` file in the root of your project and add the following environment variables:

```bash
CLOUDINARY_NAME=                  # Cloudinary account name
CLOUDINARY_API_SECRET=            # Cloudinary API secret key
CLOUDINARY_API_KEY=               # Cloudinary API key
CLOUDINARY_URL=                   # Cloudinary base URL
CLOUDINARY_UPLOAD_PRESET=         # Cloudinary upload preset

AUTH_GOOGLE_ID=                   # Google OAuth client ID
AUTH_GOOGLE_SECRET=               # Google OAuth client secret
AUTH_SECRET=                      # Secret key for encrypting and securing sessions
AUTH_URL=                         # Base URL for Auth.js
NEXTAUTH_URL=                     # Base URL for NextAuth.js redirects

DATABASE_URL=                     # Connection string for the database
```

Ensure that all required values are filled with the proper credentials.

## Getting Started

To get started with the project, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/Shivam-Sharma-1/QuickEdit.git
   cd quickedit
   ```

2. Install the necessary dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables by creating a `.env` file based on the [Environment Variables](#environment-variables) section.

4. Run the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Folder Structure

```bash
quickedit/
├── node_modules/
├── prisma/
├── public/
├── server/
├── src/
│   ├── app/
│   ├── components/
│   ├── lib/
├── .env
├── package.json
├── tailwind.config.js
└── README.md
```

- `prisma/`: Prisma schema and migration files.
- `public/`: Static files (images, icons).
- `server/`: Backend logic, including server-side functions and API utilities.
- `src/app/`: Application pages and API routes.
- `src/components/`: Reusable React components.
- `src/lib/`: Global utility functions and configurations.

## Running the Application

- Development mode: `npm run dev`
- Production build: `npm run build`
- Start production server: `npm start`
- Lint codebase: `npm run lint`
- Fix linting and import structure: `npm run lint-fix`

## Author

- **Shivam Sharma**  
  [Portfolio](https://shivam-sharma-myportfolio.vercel.app) | [LinkedIn](https://linkedin.com/in/shivamsharma77607) | [GitHub](https://github.com/Shivam-Sharma-1)

## Documentation

For more detailed documentation, please refer to the official docs of the tools and libraries used in this project:

- [Next.js Documentation](https://nextjs.org/docs)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
