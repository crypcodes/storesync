import { render, screen } from '@testing-library/react'
import DashboardPage from '../app/dashboard/page'

describe('Dashboard', () => {
  it('renders dashboard header', () => {
    render(<DashboardPage />)

    expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument()
    expect(screen.getByText(/welcome back/i)).toBeInTheDocument()
  })

  it('displays stats cards', () => {
    render(<DashboardPage />)

    expect(screen.getByText(/total sales/i)).toBeInTheDocument()
    expect(screen.getByText(/total orders/i)).toBeInTheDocument()
    expect(screen.getByText(/active products/i)).toBeInTheDocument()
    expect(screen.getByText(/connected stores/i)).toBeInTheDocument()
  })

  it('shows quick actions section', () => {
    render(<DashboardPage />)

    expect(screen.getByText(/quick actions/i)).toBeInTheDocument()
    expect(screen.getByText(/add new product/i)).toBeInTheDocument()
    expect(screen.getByText(/process orders/i)).toBeInTheDocument()
    expect(screen.getByText(/view analytics/i)).toBeInTheDocument()
  })
})