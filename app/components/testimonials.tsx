'use client'

export default function Testimonials() {
  const testimonials = [
    {
      text: "SmartTask AI has transformed how I manage my daily tasks. The AI suggestions are incredibly helpful!",
      name: 'Sarah Johnson',
      role: 'Product Manager',
      initials: 'SJ'
    },
    {
      text: "The time estimation feature is spot on. I've improved my productivity by 40% since using this tool.",
      name: 'Michael Chen',
      role: 'Software Developer',
      initials: 'MC'
    },
    {
      text: "Best task management app I've used. The AI prioritization saves me hours every week.",
      name: 'Emily Davis',
      role: 'Marketing Director',
      initials: 'ED'
    }
  ]

  return (
    <section className="testimonials">
      <div className="container">
        <div className="section-header">
          <h2>What Our Users Say</h2>
          <p>Join thousands of satisfied users who have transformed their productivity.</p>
        </div>
        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div className="testimonial-card" key={index}>
              <p className="testimonial-text">"{testimonial.text}"</p>
              <div className="testimonial-author">
                <div className="author-avatar">{testimonial.initials}</div>
                <div className="author-info">
                  <h4>{testimonial.name}</h4>
                  <p>{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
