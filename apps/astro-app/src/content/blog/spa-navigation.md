---
title: "Navegación SPA en Astro"
description: "Cómo usar ClientRouter para transiciones suaves."
pubDate: 2025-12-04
author: "Antigravity"
tags:
    - astro
    - spa
    - routing
---

# Navegación sin recargas

Con la llegada de **Astro 5**, usar `ClientRouter` (antes View Transitions) es más fácil que nunca.

Simplemente impórtalo en tu Layout y añádelo al `<head>`.

```astro
---
import { ClientRouter } from 'astro:transitions';
---
<head>
  <ClientRouter />
</head>
```

¡Y listo!
