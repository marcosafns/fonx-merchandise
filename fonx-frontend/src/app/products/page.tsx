'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface Product {
  id: number
  name: string
  description: string
  price: number
  size: string
  color: string
  model: string
  line: string
  image_url: string
  back_image_url: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [selectedModel, setSelectedModel] = useState('')
  const [selectedLine, setSelectedLine] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const router = useRouter()
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleProductClick = (id: number) => {
    router.push(`/product/${id}`)
  }

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://api.fonx.com.br/api/products')
        if (response.ok) {
          const data = await response.json()
          setProducts(data)
          setFilteredProducts(data)
        } else {
          console.error('Erro ao buscar produtos.')
        }
      } catch (error) {
        console.error('Erro de conexão:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  useEffect(() => {
    let filtered = [...products]

    if (selectedSize) {
      filtered = filtered.filter((product) => product.size.split(',').includes(selectedSize))
    }
    if (selectedColor) {
      filtered = filtered.filter((product) => product.color === selectedColor)
    }
    if (selectedModel) {
      filtered = filtered.filter((product) => product.model === selectedModel)
    }
    if (selectedLine) {
      filtered = filtered.filter((product) => product.line === selectedLine)
    }

    setFilteredProducts(filtered)
  }, [selectedSize, selectedColor, selectedModel, selectedLine, products])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowFilters(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleRadioClick = (selected: string, setter: (value: string) => void, current: string) => {
    if (selected === current) {
      setter('')
    } else {
      setter(selected)
    }
  }

  if (loading) {
    return <p>Carregando produtos...</p>
  }

  const activeFilters = [selectedSize, selectedColor, selectedModel, selectedLine].filter(Boolean).length

  return (
    <>
      <div className="products-page">
        {/* BOTÃO DE FILTRO */}
        <div className="filters-container">
          <button className="filters-button" onClick={() => setShowFilters(!showFilters)}>
            <Image src="/imgs/icons/filter.png" alt="Filtro" width="30" />
            <span className="filters-text">
              filtros{activeFilters > 0 && `(${activeFilters})`}
            </span>
          </button>

          {/* DROPDOWN */}
          {showFilters && (
            <div ref={dropdownRef} className="filters-dropdown">
              {/* TAMANHO */}
              <div className="filter-group">
                <h4>Tamanho</h4>
                {['P', 'M', 'G', 'GG'].map((size) => (
                  <label key={size}>
                    <input
                      type="radio"
                      name="size"
                      checked={selectedSize === size}
                      onClick={() => handleRadioClick(size, setSelectedSize, selectedSize)}
                      onChange={() => {}}
                    />
                    {size}
                  </label>
                ))}
              </div>

              {/* COR */}
              <div className="filter-group">
                <h4>Cor</h4>
                {['black', 'white', 'brown'].map((color) => (
                  <label key={color}>
                    <input
                      type="radio"
                      name="color"
                      checked={selectedColor === color}
                      onClick={() => handleRadioClick(color, setSelectedColor, selectedColor)}
                      onChange={() => {}}
                    />
                    {color}
                  </label>
                ))}
              </div>

              {/* MODELO */}
              <div className="filter-group">
                <h4>Modelo</h4>
                {['t-shirt', 'sweatshirt', 'nocap'].map((model) => (
                  <label key={model}>
                    <input
                      type="radio"
                      name="model"
                      checked={selectedModel === model}
                      onClick={() => handleRadioClick(model, setSelectedModel, selectedModel)}
                      onChange={() => {}}
                    />
                    {model}
                  </label>
                ))}
              </div>

              {/* LINHA */}
              <div className="filter-group">
                <h4>Linha</h4>
                {["originals'.", "déception'."].map((line) => (
                  <label key={line}>
                    <input
                      type="radio"
                      name="line"
                      checked={selectedLine === line}
                      onClick={() => handleRadioClick(line, setSelectedLine, selectedLine)}
                      onChange={() => {}}
                    />
                    {line}
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* GRID DE PRODUTOS */}
        <div className="products-page-grid">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="products-page-card"
              onClick={() => handleProductClick(product.id)}
              style={{ cursor: 'pointer' }}
              onMouseEnter={(e) => {
                const img = e.currentTarget.querySelector('img')
                if (img && product.back_image_url) img.src = product.back_image_url
                e.currentTarget.classList.add('hovered')
              }}
              onMouseLeave={(e) => {
                const img = e.currentTarget.querySelector('img')
                if (img && product.image_url) img.src = product.image_url
                e.currentTarget.classList.remove('hovered')
              }}
            >
              <h2 className="products-page-title">{product.name}</h2>

              <div className="products-page-image-container">
                <Image
                  alt={product.name}
                  src={product.image_url}
                  className="products-page-image"
                  onError={(e) => (e.currentTarget.src = '/imgs/default.png')}
                />
              </div>

              <div className="products-page-info">
                <p className="products-page-price">R$ {Number(product.price).toFixed(2)}</p>
                <p className="products-page-installments">
                  ou 3x de R$ {(Number(product.price) / 3).toFixed(2)} sem juros
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
