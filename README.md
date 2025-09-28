# AI Interview Assistant

A production-ready React application for conducting AI-powered technical interviews with comprehensive candidate management and evaluation.

## Features

### Interviewee Tab
- **Resume Upload**: Support for PDF and DOCX files with automatic data extraction
- **Smart Data Extraction**: Automatically extracts name, email, and phone from resumes
- **Timed Interview**: 6 questions total (2 Easy/20s, 2 Medium/60s, 2 Hard/120s)
- **Auto-submit**: Answers are automatically submitted when timer expires
- **Real-time Chat**: Interactive chat interface with AI interviewer
- **Progress Tracking**: Visual progress indicator and question counter

### Interviewer Dashboard
- **Candidate Management**: View all candidates with search and sort functionality
- **Detailed Profiles**: Complete candidate information including resume and contact details
- **Interview History**: Full chat history and answer timeline
- **AI Evaluation**: Automated scoring and detailed candidate summaries
- **Performance Analytics**: Visual progress tracking and score distribution

### Technical Features
- **State Persistence**: Redux with redux-persist for data persistence across sessions
- **Welcome Back Modal**: Restores interview state after page refresh
- **Error Handling**: Comprehensive error handling for file uploads and validation
- **Responsive Design**: Mobile and desktop optimized UI
- **Mock AI Integration**: Ready for OpenAI API integration

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **State Management**: Redux Toolkit with redux-persist
- **UI Library**: Ant Design
- **File Processing**: pdf-parse (PDF), mammoth (DOCX)
- **Build Tool**: Create React App
- **Styling**: CSS with responsive design

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
https://github.com/Smriti1511s/AI-Powered-Interview-Assistant-interview-buddy-.git
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Building for Production

```bash
npm run build
```

This builds the app for production to the `build` folder.

## Project Structure

```
src/
├── api/                    # AI mock services
├── app/                    # Redux store configuration
├── components/             # React components
│   ├── Chat/              # Chat interface components
│   ├── Dashboard/         # Interviewer dashboard
│   ├── Resume/            # Resume upload and preview
│   ├── UI/                # Shared UI components
│   └── Common/            # Reusable components
├── features/              # Redux slices and selectors
├── hooks/                 # Custom React hooks
├── utils/                 # Utility functions
├── types/                 # TypeScript type definitions
└── styles/                # Global styles
```

## Usage

### For Interviewees
1. Upload your resume (PDF or DOCX)
2. Verify extracted information
3. Start the interview
4. Answer 6 questions within the time limits
5. Receive your final score and evaluation

### For Interviewers
1. Switch to the Interviewer Dashboard tab
2. View all candidates with search and sort options
3. Click on any candidate to see detailed information
4. Review interview history, answers, and AI evaluation
5. Download resumes and export candidate data

## Configuration

### Environment Variables
Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

### AI Integration
The app currently uses mock AI services. To integrate with OpenAI:

1. Add your API key to `.env`:
```
REACT_APP_OPENAI_API_KEY=your_api_key_here
```

2. Update the AI service in `src/api/aiMock.ts` to use real OpenAI endpoints

## Deployment

### Netlify
1. Build the project: `npm run build`
2. Deploy the `build` folder to Netlify
3. Configure environment variables in Netlify dashboard

### Vercel
1. Connect your GitHub repository to Vercel
2. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `build`
3. Add environment variables in Vercel dashboard

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the GitHub repository.
