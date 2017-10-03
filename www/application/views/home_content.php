<header class="header center">
  <p class="site-title-sub">Programer's home</p>
  <h1 class="site-title">嗨，我是阿邦</h1>
  <p class="site-description">Check out some of my works.</p>
  <div class="buttons">
    <a class="button" href="#about">關於我</a>
    <a class="button button-showy" href="#contact">留言給我</a>
  </div>
</header>
<section class="about center" id="about">
  <h2 class="heading">關於我</h2>
  <p class="about-text">
主要是使用PHP開發網頁，使用MySQL5搭配Javascript以及CSS。<br>
目前開發工作經驗6年，以及搭配使用CI的框架。
  </p>
  <p class="about-text">
陸續增加功能及文章分享。<br>
希望記錄許多有關程式碼或生活上的相關知識。
  </p>
</section>
<section class="works center">
  <h2 class="heading">相關作品</h2>
  <div class="works-wrapper">
    <div class="work-box tree">
      <img class="work-image" src="<?php echo IMAGE_WWW_IMAGES;?>tree.jpg" alt="賓客系統">
      <div class="work-description">
        <div class="work-description-inner">
          <p class="work-text">
            賓客系統<br />
            <a href="<?php echo HTML_HREF_GUEST;?>" class="button button-ghost">更多</a>
          </p>
        </div>
      </div>
    </div>
    <div class="work-box building">
      <img class="work-image" src="<?php echo IMAGE_WWW_IMAGES;?>building.jpg" alt="隨手記">
      <div class="work-description">
        <div class="work-description-inner">
          <p class="work-text">
            隨手記<br />
            <a href="<?php echo HTML_HREF_MEMO;?>" class="button button-ghost">更多</a>
          </p>
        </div>
      </div>
    </div>
    <div class="work-box lake">
      <img class="work-image" src="<?php echo IMAGE_WWW_IMAGES;?>lake.jpg" alt="會員系統">
      <div class="work-description">
        <div class="work-description-inner">
          <p class="work-text">
            會員系統<br />
            <a href="<?php echo HTML_HREF_ACCOUNT;?>" class="button button-ghost">更多</a>
          </p>
        </div>
      </div>
    </div>
    <div class="work-box sky">
      <img class="work-image" src="<?php echo IMAGE_WWW_IMAGES;?>sky.jpg" alt="相關作品4">
      <div class="work-description">
        <div class="work-description-inner">
          <p class="work-text">
            陸續增加中<br />
            <a href="#" class="button button-ghost">開發中</a>
          </p>
        </div>
      </div>
    </div>
  </div>
</section>
<section class="skills center">
  <h2 class="heading">我的技能</h2>
  <div class="skills-wrapper">
    <div class="skill-box">
      <i class="skill-icon fa fa-lightbulb-o"></i>
      <div class="skill-title">IDEA</div>
      <p class="skill-text">
        我喜歡思考事情。<br>
        我喜歡嘗試和思考新事物。
      </p>
    </div>
    <div class="skill-box">
      <i class="skill-icon fa fa-paint-brush"></i>
      <div class="skill-title">DESIGN</div>
      <p class="skill-text">
        設計的簡單清楚以及嚴謹，<br>
        是身為設計師必備的技能。
      </p>
    </div>
    <div class="skill-box">
      <i class="skill-icon fa fa-code"></i>
      <div class="skill-title">CODING</div>
      <p class="skill-text">
        我會寫 PHP/Javascript/MySQL 程式碼，<br>
        不斷的精進中，<br>
        並考慮未來修改的延展性。
      </p>
    </div>
  </div>
</section>
<section class="contact center" id="contact">
  <h2 class="heading">聯絡我</h2>
  <form class="contact-form">
    <input type="text" name="name" placeholder="NAME">
    <textarea name="message" placeholder="MESSAGE"></textarea>
    <input type="submit" value="SEND">
  </form>
</section>