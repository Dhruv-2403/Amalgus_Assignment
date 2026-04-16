// Simple TF-IDF + Cosine Similarity matching engine

class MatchingEngine {
  constructor() {
    this.documents = [];
    this.vocabulary = new Set();
    this.idf = {};
  }

  tokenize(text) {
    if (!text) return [];
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2);
  }

  buildVocabulary(documents) {
    this.vocabulary = new Set();
    documents.forEach(doc => {
      const tokens = this.tokenize(doc);
      tokens.forEach(token => this.vocabulary.add(token));
    });
  }

  // Calculate IDF for each term
  calculateIDF(documents) {
    const docCount = documents.length;
    this.idf = {};
    
    this.vocabulary.forEach(term => {
      const docsWithTerm = documents.filter(doc => 
        this.tokenize(doc).includes(term)
      ).length;
      this.idf[term] = Math.log(docCount / (docsWithTerm + 1));
    });
  }

  // Calculate TF-IDF vector for a document
  calculateTFIDF(document) {
    const tokens = this.tokenize(document);
    const termFreq = {};
    
    tokens.forEach(token => {
      termFreq[token] = (termFreq[token] || 0) + 1;
    });
    
    const vector = [];
    this.vocabulary.forEach(term => {
      const tf = termFreq[term] || 0;
      const idf = this.idf[term] || 0;
      vector.push(tf * idf);
    });
    
    return vector;
  }

  // cosine similarity
  cosineSimilarity(vec1, vec2) {
    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;
    
    for (let i = 0; i < vec1.length; i++) {
      dotProduct += vec1[i] * vec2[i];
      norm1 += vec1[i] * vec1[i];
      norm2 += vec2[i] * vec2[i];
    }
    
    if (norm1 === 0 || norm2 === 0) return 0;
    return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
  }


  initialize(products) {

    this.documents = products.map(product => {
      return [
        product.name,
        product.category,
        product.thickness,
        product.color,
        product.coating,
        product.certification,
        product.edgeFinish,
        product.supplier,
        product.description
      ].join(' ');
    });
    
    this.buildVocabulary(this.documents);
    this.calculateIDF(this.documents);
    

    this.productVectors = this.documents.map(doc => this.calculateTFIDF(doc));
  }


  findMatches(query, products, topK = 5) {
    const queryVector = this.calculateTFIDF(query);
    
    const scores = products.map((product, index) => {
      const similarity = this.cosineSimilarity(queryVector, this.productVectors[index]);
      return {
        product,
        score: similarity
      };
    });
    
    // Sort by descending score and take top K
    const topMatches = scores
      .sort((a, b) => b.score - a.score)
      .slice(0, topK)
      .filter(match => match.score > 0.01); // Filter out very low scores
    
    return topMatches.map(match => ({
      ...match.product,
      matchScore: Math.round(match.score * 100),
      matchExplanation: this.generateExplanation(query, match.product)
    }));
  }


  generateExplanation(query, product) {
    const queryTokens = this.tokenize(query);
    const productText = [
      product.name,
      product.category,
      product.thickness,
      product.color,
      product.coating,
      product.edgeFinish,
      product.description
    ].join(' ').toLowerCase();
    
    const matchedAttributes = [];
    

    if (queryTokens.some(t => t.includes('mm') || /^\d+$/.test(t))) {
      const thicknessMatch = queryTokens.find(t => 
        productText.includes(t) || (t.includes('mm') && productText.includes(t.replace('mm', '')))
      );
      if (thicknessMatch) {
        matchedAttributes.push(`${thicknessMatch.replace('mm', '')}mm thickness`);
      } else if (product.thickness) {
        matchedAttributes.push(`${product.thickness} thickness`);
      }
    }
    

    const colors = ['clear', 'tint', 'bronze', 'frosted', 'reflective', 'white'];
    const colorMatch = colors.find(c => queryTokens.includes(c) && productText.includes(c));
    if (colorMatch) {
      matchedAttributes.push(`${colorMatch} color`);
    } else if (product.color !== 'Clear') {
      matchedAttributes.push(product.color);
    }
    

    const coatings = ['uv', 'low-e', 'solar', 'reflective', 'coated'];
    const coatingMatch = coatings.find(c => queryTokens.includes(c) && productText.includes(c));
    if (coatingMatch) {
      matchedAttributes.push(`${coatingMatch} coating`);
    } else if (product.coating && product.coating !== 'None') {
      matchedAttributes.push(product.coating);
    }
    

    const edges = ['polished', 'flat', 'raw', 'sealed'];
    const edgeMatch = edges.find(e => queryTokens.includes(e) && productText.includes(e));
    if (edgeMatch) {
      matchedAttributes.push(`${edgeMatch} edges`);
    } else if (product.edgeFinish && product.edgeFinish !== 'N/A') {
      matchedAttributes.push(`${product.edgeFinish} edge finish`);
    }
    

    const applications = {
      'partition': 'partitions',
      'balcony': 'balcony',
      'railing': 'railings',
      'window': 'windows',
      'door': 'doors',
      'shower': 'shower',
      'office': 'office',
      'residential': 'residential',
      'commercial': 'commercial',
      'energy': 'energy-efficient',
      'thermal': 'thermal insulation',
      'fire': 'fire-rated',
      'safety': 'safety'
    };
    
    Object.entries(applications).forEach(([queryTerm, appTerm]) => {
      if (queryTokens.includes(queryTerm) && productText.includes(appTerm)) {
        matchedAttributes.push(`suitable for ${appTerm}`);
      }
    });
    

    if (queryTokens.includes('budget') || queryTokens.includes('cheap') || queryTokens.includes('affordable')) {
      if (product.price < 50) {
        matchedAttributes.push('budget-friendly');
      }
    }
    

    if (matchedAttributes.length === 0) {
      matchedAttributes.push(product.category);
    }
    

    if (matchedAttributes.length === 0) {
      return `Matches based on general similarity to your query`;
    }
    
    return `Matches because: ${matchedAttributes.slice(0, 3).join(', ')}`;
  }
}

export default MatchingEngine;
