--- 
layout: compress
---
<!doctype html>
<html lang="en">
    <title>{% if page.title %}{{ page.title }} – {% endif %}{{ site.title }}</title>
    <head prefix="og: {{ site.url }}">
    <link rel="shortcut icon" href="{% if page.icon %}{{ page.icon }}{% endif %}" type="image/x-icon">
    <link rel="stylesheet" href="{{ page.css }}">
    <link rel="stylesheet" href="/css/project.css">
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link rel="preload" href="/css/global.css?v=1.6" as="style" onload="this.onload=null;this.rel='stylesheet'">
    <noscript><link rel="stylesheet" href="/css/global.css?v=2.0"></noscript>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="{% if page.description %}{{ page.description }} {% elsif page.categories %}{{ page.excerpt | truncate: 120 | strip_html }}{% else %}{{ site.description }}{% endif %}">
    <meta property="og:title" content="{% if page.title %}{{ page.title }} – {% endif %}{{ site.title }}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="{{ site.url }}{% if page.url %}{{ page.url }}{% endif %}" />
    <meta property="og:image" content="{{ page.icon_larger }}" />
    <meta property="og:description" content="{% if page.description %}{{ page.description }} {% elsif page.categories %}{{ page.excerpt | truncate: 120 | strip_html }}{% else %}{{ site.description }}{% endif %}" />
    <!-- Discord Colour -->
    <meta name="theme-color" content="{{ page.discord_colour }}">
    <!-- Twitter stuffs -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:image" content="{% if page.icon %}{{ page.icon}} {% else %} /images/profilePic.webp {% endif %}">
</head>
    <body>
        {% include copyright.html %}
        {% include navbar.html %}
        {{ content }}
    </body>
    {% include footer.html %}
</html>