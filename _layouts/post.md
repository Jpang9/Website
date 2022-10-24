--- 
layout: page 
---

<div class="main">
    <div class="page-title center">{{ page.title }}</div>
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

</div>