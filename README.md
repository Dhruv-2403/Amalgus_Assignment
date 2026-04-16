# AmalGus Smart Product Discovery

A minimal working prototype of an intelligent product matching system for the glass industry marketplace. Built with React, Tailwind CSS, and a custom TF-IDF + cosine similarity matching engine.

## How to Run Locally

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Step-by-Step Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Amalgus_Assignment
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` (or the URL shown in your terminal)

5. **Try it out**
   - Type a natural language requirement in the search box
   - Use the example queries provided
   - Apply filters by category or max price
   - Click "Find Best Matches" to see ranked results

### Build for Production
```bash
npm run build
npm run preview
```

## Tech Stack

- **Frontend Framework**: React 19.2.4 with Vite 8.0.4
- **Styling**: Tailwind CSS v4 with @tailwindcss/postcss (utility-first CSS framework)
- **Matching Engine**: Custom TF-IDF + Cosine Similarity (pure JavaScript, no external dependencies)
- **Build Tool**: Vite (fast HMR and optimized builds)
- **Package Manager**: npm

## How the Intelligent Matching Works

The matching system uses a **TF-IDF (Term Frequency-Inverse Document Frequency) + Cosine Similarity** approach to understand buyer requirements and find relevant products:

### 1. Text Preprocessing
- Tokenizes natural language queries and product descriptions
- Normalizes text (lowercase, removes special characters)
- Filters out short words (< 3 characters)

### 2. Vocabulary Building
- Creates a vocabulary from all product attributes (name, category, thickness, color, coating, certification, edge finish, description)
- Each unique term becomes a dimension in the vector space

### 3. TF-IDF Vectorization
- **TF (Term Frequency)**: How often a term appears in a document
- **IDF (Inverse Document Frequency)**: How unique/rare a term is across all documents
- Combines these to create weighted vectors that capture the importance of each term

### 4. Cosine Similarity Calculation
- Measures the angle between query vector and product vectors
- Returns a score between 0-1 (0 = no match, 1 = perfect match)
- Higher scores indicate better semantic similarity

### 5. Explanation Generation
- Analyzes which specific attributes matched (thickness, color, coating, application, etc.)
- Generates human-readable explanations for why each product matched
- Highlights the most relevant matching features

### Example
For a query like "6mm tempered glass for office partitions with polished edges":
- The system identifies key terms: "6mm", "tempered", "glass", "office", "partition", "polished"
- Calculates similarity scores with all products
- Returns products with high scores and explains: "Matches because: 6mm thickness, tempered glass, polished edges, suitable for partitions"

## AI Tools Used
I have used cascade ai and chatgpt for making and giving proper structure to readme and also used in some parts of intelligent matching of tf-idf vectorization logic.
### What Was Built Manually:
- The matching algorithm logic (TF-IDF + cosine similarity) was implemented from scratch
- All product data was created specifically for the glass industry
- The UI design decisions were made to prioritize usability
- The explanation generation logic was custom-built for this domain

### Key Insight:
The AI helped with **speed and structure**, but the **domain knowledge** (glass industry specifications, buyer needs, matching criteria) was built into the system through carefully crafted product data and matching logic.

## Key Assumptions & Trade-offs

### Assumptions:
1. **Buyer Language**: Buyers use natural language with specific technical terms (mm, tempered, laminated, etc.)
2. **Product Completeness**: All products have complete specifications (thickness, color, coating, etc.)
3. **Matching Priority**: Technical specifications (thickness, type) are more important than price for matching
4. **Query Intent**: Buyers know what they want and can describe it in natural language

### Trade-offs Made:
1. **TF-IDF vs. Deep Learning Embeddings**
   - **Choice**: TF-IDF + cosine similarity (pure JavaScript)
   - **Reason**: Fast to implement, no external API dependencies, works entirely in-browser, completely free
   - **Trade-off**: Less sophisticated semantic understanding than transformer-based embeddings, but sufficient for this prototype

2. **Client-side vs. Server-side Processing**
   - **Choice**: All processing in the browser
   - **Reason**: Faster development, no backend needed, instant feedback
   - **Trade-off**: Limited to small datasets (100s of products), not suitable for millions of products

3. **Mock Data vs. Real Data**
   - **Choice**: 15 carefully crafted mock products
   - **Reason**: Ensures representative coverage of glass industry categories
   - **Trade-off**: Limited variety compared to a real marketplace with thousands of products

4. **Simple Filters vs. Advanced Faceted Search**
   - **Choice**: Basic category and price filters
   - **Reason**: Kept the UI simple and focused on the AI matching feature
   - **Trade-off**: Less granular control for power users

5. **Explanation Simplicity**
   - **Choice**: Rule-based explanation generation
   - **Reason**: Deterministic, easy to understand, no external AI needed
   - **Trade-off**: Explanations are template-based rather than dynamically generated by an LLM

## Evaluation Criteria Addressed

### 1. Quality of Intelligent Matching
- **Approach**: TF-IDF + cosine similarity captures semantic meaning of technical terms
- **Strengths**: Handles synonyms (glass, tempered, laminated), understands specifications (6mm, UV protected), matches applications (partitions, balcony)
- **Explainability**: Each match includes a clear explanation of why it matched

### 2. Speed of Delivery
- **Timeline**: Built in under 2 hours
- **Approach**: Used Vite for fast development, Tailwind for rapid styling, custom JS for matching (no complex setup)

### 3. Effective Use of AI Tools
- **Cascade AI**: Used for code generation, structure, and documentation
- **Smart Leverage**: AI handled boilerplate and implementation details, while domain knowledge was manually encoded
- **No Blind Copying**: All code was reviewed and adapted for the specific use case

### 4. Code Clarity + README Quality
- **Structure**: Clear separation of concerns (data, utils, components)
- **Comments**: Well-documented matching engine
- **README**: Comprehensive with all required sections

### 5. User Experience & Relevance
- **UI**: Clean, modern interface with Tailwind CSS
- **UX**: Example queries, instant feedback, visual match scores
- **Domain**: Glass industry-specific products and terminology

## Project Structure

```
Amalgus_Assignment/
├── src/
│   ├── data/
│   │   └── products.js     
│   ├── utils/
│   │   └── matchingEngine.js    
│   ├── App.jsx                
│   ├── main.jsx                 
│   └── index.css               
├── public/                       
├── index.html                  
├── package.json                 
├── tailwind.config.js           configuration
├── postcss.config.js            configuration
├── vite.config.js               
└── README.md                   
```

## Example Queries to Try

1. "I need 6mm tempered glass for office cabin partitions, clear, size around 2m x 1.2m, with polished edges"
2. "Looking for laminated safety glass for balcony railing, 8-10mm thick, UV protected, good for high wind areas"
3. "Budget-friendly 4mm float glass for windows in a residential project, large quantity needed"
4. "Insulated glass units for energy-efficient windows, 5+12+5 configuration, 2m height"
5. "Frosted glass for bathroom privacy"
6. "Heat reflective glass for commercial building facade"

## Deployment

### Vercel Deployment




## Future Improvements

1. **Add more products**: Expand to 50+ products for better matching
2. **Use real embeddings**: Integrate OpenAI or sentence-transformers for better semantic understanding
3. **Add more filters**: Thickness range, color, coating type, certification
4. **Backend API**: Move matching to a server for scalability
5. **User feedback**: Learn from user clicks to improve matching
6. **Multi-language**: Support queries in multiple languages