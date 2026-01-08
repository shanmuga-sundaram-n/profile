---
layout: page
title: Contact
description: Get in touch with me
permalink: /contact/
---

<div class="grid grid-2" style="margin-bottom: var(--space-2xl);">
  <div class="card card-glass">
    <h3><i class="fas fa-envelope"></i> Email</h3>
    <p>Feel free to reach out via email for any inquiries, collaborations, or just to say hello!</p>
    <a href="mailto:{{ site.email }}" class="btn btn-primary">
      <i class="fas fa-paper-plane"></i> Send Email
    </a>
  </div>
  
  <div class="card card-glass">
    <h3><i class="fas fa-share-alt"></i> Social Media</h3>
    <p>Connect with me on various platforms to stay updated with my latest work and thoughts.</p>
    <div class="social-links" style="margin-top: var(--space-md);">
      {% for link in site.social_links %}
      <a href="{{ link.url }}" class="social-link" target="_blank" rel="noopener" aria-label="{{ link.name }}" style="width: 50px; height: 50px; font-size: 1.5rem;">
        <i class="{{ link.icon }}"></i>
      </a>
      {% endfor %}
    </div>
  </div>
</div>

## Let's Work Together

I'm currently **available for**:

- 💼 **Freelance Projects** - Full-stack development, cloud architecture, and technical consulting
- 🤝 **Collaborations** - Open-source contributions and interesting side projects
- 📝 **Technical Writing** - Guest posts, tutorials, and documentation
- 🎤 **Speaking Engagements** - Tech talks and workshops

## Quick Links

- **GitHub**: [github.com/shanmuga-sundaram-n](https://github.com/shanmuga-sundaram-n)
- **LinkedIn**: [linkedin.com/in/shanmuga-sundaram-n](https://linkedin.com/in/shanmuga-sundaram-n)
- **Email**: [{{ site.email }}](mailto:{{ site.email }})

---

<div class="card text-center" style="background: var(--gradient-primary); padding: var(--space-2xl); margin-top: var(--space-2xl);">
  <h2 style="color: white; margin-bottom: var(--space-md);">Have a Project in Mind?</h2>
  <p style="color: rgba(255, 255, 255, 0.9); font-size: var(--font-size-lg); margin-bottom: var(--space-xl);">
    I'd love to hear about it! Whether it's a new opportunity, a collaboration, or just a chat about technology, don't hesitate to reach out.
  </p>
  <a href="mailto:{{ site.email }}" class="btn btn-secondary" style="background: white; color: var(--color-accent-primary);">
    <i class="fas fa-envelope"></i> Get in Touch
  </a>
</div>
