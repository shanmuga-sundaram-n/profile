---
layout: page
title: Projects
description: Explore my portfolio of projects and technical work
permalink: /projects/
---

<div class="grid grid-3">
  {% for project in site.data.projects %}
  <div class="project-card">
    <img src="{{ project.image | relative_url }}" alt="{{ project.title }}" class="project-image">
    <div class="project-content">
      <h3 class="project-title">{{ project.title }}</h3>
      <p class="project-description">{{ project.description }}</p>
      
      <div class="tags">
        {% for tech in project.technologies %}
        <span class="tag">{{ tech }}</span>
        {% endfor %}
      </div>
      
      <div class="project-links">
        {% if project.github %}
        <a href="{{ project.github }}" class="btn btn-secondary" target="_blank" rel="noopener">
          <i class="fab fa-github"></i> Code
        </a>
        {% endif %}
        {% if project.demo %}
        <a href="{{ project.demo }}" class="btn btn-primary" target="_blank" rel="noopener">
          <i class="fas fa-external-link-alt"></i> Demo
        </a>
        {% endif %}
      </div>
    </div>
  </div>
  {% endfor %}
</div>

---

## More Projects Coming Soon!

I'm constantly working on new projects and experiments. Check back regularly or follow me on [GitHub](https://github.com/shanmuga-sundaram-n) to see what I'm building next.

### Want to Collaborate?

I'm always open to interesting project ideas and collaborations. If you have a project in mind or want to work together, feel free to [get in touch](/contact/)!
