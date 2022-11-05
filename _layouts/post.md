--- 
layout: page 
---

<div class="main">
    <div class="page-title center"><b>{{ page.title }}</b></div>
    <article class="entry">
        <div class="text">{{ content }}</div>
        <div class="date">
            Written on {{ page.date | date: "%B %e, %Y" }}
        </div>
    </article>
    <!-- Yucky br but I'm lazy -->
    <br>
    <br>
    <br>
    <br>
    <div class="preview">
    <img src=""/>
    </div>
</div>

<script src="/js/post.js?v=0.1"></script>