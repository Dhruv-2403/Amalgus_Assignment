import { useState, useEffect } from 'react'
import { products } from './data/products'
import MatchingEngine from './utils/matchingEngine'

function App() {
  const [query, setQuery] = useState('')
  const [matches, setMatches] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [maxPrice, setMaxPrice] = useState('')
  const [matchingEngine] = useState(() => new MatchingEngine())

  // Initialize matching engine with products
  useEffect(() => {
    matchingEngine.initialize(products)
  }, [matchingEngine])

  // Get unique categories
  const categories = ['all', ...new Set(products.map(p => p.category))]

  // Filter products based on selected filters
  const getFilteredProducts = () => {
    let filtered = [...products]
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory)
    }
    
    if (maxPrice) {
      filtered = filtered.filter(p => p.price <= parseInt(maxPrice))
    }
    
    return filtered
  }

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsSearching(true)

    // Simulate processing delay for better UX
    setTimeout(() => {
      const filteredProducts = getFilteredProducts()
      const results = matchingEngine.findMatches(query, filteredProducts, 5)
      setMatches(results)
      setIsSearching(false)
    }, 500)
  }

  // Get match score color
  const getScoreColor = (score) => {
    if (score >= 80) return 'bg-green-500'
    if (score >= 60) return 'bg-yellow-500'
    if (score >= 40) return 'bg-orange-500'
    return 'bg-red-500'
  }

  // Example queries
  const exampleQueries = [
    "I need 6mm tempered glass for office cabin partitions, clear, size around 2m x 1.2m, with polished edges",
    "Looking for laminated safety glass for balcony railing, 8-10mm thick, UV protected, good for high wind areas",
    "Budget-friendly 4mm float glass for windows in a residential project, large quantity needed",
    "Insulated glass units for energy-efficient windows, 5+12+5 configuration, 2m height"
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-indigo-900">AmalGus</h1>
              <p className="text-gray-600">Smart Product Discovery for Glass Industry</p>
            </div>
            <div className="text-sm text-gray-500">
              Powered by AI Matching
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Describe Your Requirements
          </h2>
          
          <form onSubmit={handleSearch} className="space-y-6">
            {/* Query Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What are you looking for?
              </label>
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g., I need 6mm tempered glass for office partitions with polished edges..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                rows={3}
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat === 'all' ? 'All Categories' : cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Price (per unit)
                </label>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="e.g., 100"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!query.trim() || isSearching}
              className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSearching ? 'Finding Best Matches...' : 'Find Best Matches'}
            </button>
          </form>

          {/* Example Queries */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-3">Try these example queries:</p>
            <div className="flex flex-wrap gap-2">
              {exampleQueries.map((example, index) => (
                <button
                  key={index}
                  onClick={() => setQuery(example)}
                  className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-full transition-colors"
                >
                  {example.substring(0, 50)}...
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Section */}
        {matches.length > 0 && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">
              Top {matches.length} Matches Found
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matches.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                >
                  {/* Match Score Badge */}
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">
                        Match Score
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${getScoreColor(product.matchScore)}`}
                            style={{ width: `${product.matchScore}%` }}
                          />
                        </div>
                        <span className="text-sm font-bold text-gray-800">
                          {product.matchScore}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      {product.name}
                    </h4>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm">
                        <span className="text-gray-500 w-24">Category:</span>
                        <span className="text-gray-900 font-medium">{product.category}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <span className="text-gray-500 w-24">Thickness:</span>
                        <span className="text-gray-900 font-medium">{product.thickness}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <span className="text-gray-500 w-24">Color:</span>
                        <span className="text-gray-900 font-medium">{product.color}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <span className="text-gray-500 w-24">Price:</span>
                        <span className="text-gray-900 font-medium">
                          ${product.price}/{product.priceUnit}
                        </span>
                      </div>
                    </div>

                    {/* Match Explanation */}
                    <div className="bg-indigo-50 rounded-lg p-3 mb-4">
                      <p className="text-xs text-indigo-800">
                        <strong>Why this matches:</strong> {product.matchExplanation}
                      </p>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {product.description}
                    </p>

                    {/* Supplier */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <span className="text-xs text-gray-500">
                        Supplier: {product.supplier}
                      </span>
                      <button className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full hover:bg-indigo-200 transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {matches.length === 0 && query && !isSearching && (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <p className="text-gray-500">
              No matches found. Try adjusting your search or filters.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-gray-500">
          <p>AmalGus Smart Product Discovery Prototype</p>
          <p className="mt-1">Built with React, Tailwind CSS, and AI-powered semantic matching</p>
        </div>
      </footer>
    </div>
  )
}

export default App
