import { render, screen } from '@testing-library/react'
import Header from '../Header'

// Mock the scrollIntoView function
Object.defineProperty(Element.prototype, 'scrollIntoView', {
  value: jest.fn(),
  writable: true
})

describe('Header Component', () => {
  it('renders the ParentWise brand', () => {
    render(<Header />)
    expect(screen.getByText('ParentWise')).toBeInTheDocument()
  })

  it('renders navigation links', () => {
    render(<Header />)
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('About')).toBeInTheDocument()
    expect(screen.getByText('Contact')).toBeInTheDocument()
  })

  it('has proper styling classes', () => {
    render(<Header />)
    const header = screen.getByRole('banner')
    expect(header).toHaveClass('fixed', 'top-0', 'z-50')
  })
})