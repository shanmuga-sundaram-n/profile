---
layout: page
title: Blog
description: Technical articles, tutorials, and insights
permalink: /blog/
---

<div class="section-header">
  <h2 class="section-title">Latest Posts</h2>
  <p class="section-subtitle">Thoughts, tutorials, and technical insights</p>
</div>

<div class="grid grid-2">
  {% for post in site.posts %}
  <article class="post-card">
    <div class="post-meta">
      <span><i class="far fa-calendar"></i> {{ post.date | date: "%B %d, %Y" }}</span>
      {% if post.categories %}
      <span><i class="fas fa-folder"></i> {{ post.categories | join: ', ' }}</span>
      {% endif %}
    </div>
    <h3 class="post-title">
      <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
    </h3>
    <p class="post-excerpt">{{ post.excerpt | strip_html | truncate: 200 }}</p>
    <a href="{{ post.url | relative_url }}" class="read-more">
      Read More <i class="fas fa-arrow-right"></i>
    </a>
  </article>
  {% endfor %}
</div>

{% if site.posts.size == 0 %}
<div class="card text-center" style="padding: var(--space-2xl);">
  <h3>No posts yet!</h3>
  <p>Check back soon for new content.</p>
</div>
{% endif %}
