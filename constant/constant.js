
export const themeUrl = 'https://funnelliner.com';
export const visitorUrl = 'https://funnelliner-report-api.vercel.app/api/v1/';
export const pixel_demo_text = `Example: <script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init','YOUR_PIXEL_ID'); // Replace YOUR_PIXEL_ID with your actual Pixel ID
fbq('track', 'PageView');
</script>
<!-- Place the noscript alternative tracking code right after the JavaScript code -->
<noscript>
<img height="1" width="1" style="display:none" 
     src="https://www.facebook.com/tr?id=YOUR_PIXEL_ID&ev=PageView&noscript=1"/>
</noscript>`;

export const googleTagManagerText = (
  <ol>
    <li>
      Paste this code as high in the &lt;head &gt; of the page as possible
    </li>
  </ol>
);

export const googleTagManagerNoscript = (
  <ol>
    <li>Paste this code immediately after the opening &lt;body &gt; tag</li>
  </ol>
);

export const domainRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/i ;
