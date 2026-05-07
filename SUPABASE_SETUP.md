# Configuración de Supabase para Donara

Guía completa para configurar tu base de datos en Supabase.

## 1. Tablas Requeridas

Crea las siguientes tablas en tu proyecto de Supabase:

### Tabla: `donors` (Donantes)

```sql
CREATE TABLE donors (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  profile_image_url TEXT,
  bio TEXT,
  total_donations DECIMAL(10, 2) DEFAULT 0,
  donations_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id)
);
```

### Tabla: `foundations` (Fundaciones)

```sql
CREATE TABLE foundations (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  initials TEXT,
  color TEXT,
  description TEXT,
  mission TEXT,
  vision TEXT,
  category TEXT,
  coverage TEXT,
  contact TEXT,
  website TEXT,
  image_url TEXT,
  verified BOOLEAN DEFAULT FALSE,
  total_beneficiaries INT DEFAULT 0,
  active_campaigns INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id)
);
```

### Tabla: `campaigns` (Campañas)

```sql
CREATE TABLE campaigns (
  id BIGSERIAL PRIMARY KEY,
  foundation_id BIGINT REFERENCES foundations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  goal DECIMAL(10, 2),
  raised DECIMAL(10, 2) DEFAULT 0,
  status TEXT DEFAULT 'active',
  category TEXT,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Tabla: `donations` (Donaciones)

```sql
CREATE TABLE donations (
  id BIGSERIAL PRIMARY KEY,
  donor_id BIGINT REFERENCES donors(id) ON DELETE CASCADE,
  campaign_id BIGINT REFERENCES campaigns(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending',
  message TEXT,
  anonymous BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 2. Storage Buckets (para imágenes y archivos)

Crea los siguientes buckets en Supabase Storage:

- `donor-profiles` - Imágenes de perfil de donantes
- `foundation-images` - Imágenes de fundaciones
- `campaign-images` - Imágenes de campañas

### Configuración de cada bucket:

1. Ve a Storage en tu dashboard de Supabase
2. Click en "Create a new bucket"
3. Nombre: (según corresponda)
4. Visibilidad: Public (para que se puedan ver las imágenes)
5. Click en Create

## 3. Row Level Security (RLS) - Seguridad

Es importante configurar políticas de seguridad. Ejemplos:

### Para la tabla `donors`:

```sql
-- Usuarios solo ven su propio perfil de donante
CREATE POLICY "Users can view own donor profile" ON donors
FOR SELECT USING (auth.uid() = user_id);

-- Usuarios pueden actualizar su propio perfil
CREATE POLICY "Users can update own donor profile" ON donors
FOR UPDATE USING (auth.uid() = user_id);
```

### Para la tabla `foundations`:

```sql
-- Todos pueden ver fundaciones verificadas
CREATE POLICY "Anyone can view verified foundations" ON foundations
FOR SELECT USING (verified = true);

-- Usuarios solo ven/actualizan su fundación
CREATE POLICY "Users can view own foundation" ON foundations
FOR SELECT USING (auth.uid() = user_id);
```

## 4. Uso en tu Aplicación

### Ejemplo: Registrar un nuevo donante

```jsx
import { useAuth } from "@/context/AuthContext";
import { signup } from "@/lib/supabaseClient";

function SignupPage() {
    const { signup: signupUser } = useAuth();

    const handleSignup = async (email, password, name) => {
        try {
            await signupUser(email, password, { first_name: name }, "donor");
            // Redirigir a dashboard del donante
        } catch (error) {
            console.error("Error al registrarse:", error.message);
        }
    };

    return (
        // Tu formulario aquí
    );
}
```

### Ejemplo: Obtener fundaciones

```jsx
import { useEffect, useState } from 'react';
import { getFoundations } from '@/lib/supabaseClient';

function FoundationsPage() {
	const [foundations, setFoundations] = useState([]);

	useEffect(() => {
		const loadFoundations = async () => {
			try {
				const data = await getFoundations();
				setFoundations(data);
			} catch (error) {
				console.error('Error:', error);
			}
		};

		loadFoundations();
	}, []);

	return (
		<div>
			{foundations.map((foundation) => (
				<div key={foundation.id}>{foundation.name}</div>
			))}
		</div>
	);
}
```

### Ejemplo: Hacer una donación

```jsx
import { makeDonation } from '@/lib/databaseUtils';

async function handleDonation(donorId, campaignId, amount) {
	try {
		const donation = await makeDonation({
			donor_id: donorId,
			campaign_id: campaignId,
			amount,
			status: 'completed',
		});
		console.log('Donación realizada:', donation);
	} catch (error) {
		console.error('Error:', error);
	}
}
```

## 5. Variables de Entorno

Las credenciales ya están configuradas en `src/lib/supabaseClient.js`.

Para producción, considera usar variables de entorno:

```env
VITE_SUPABASE_URL=https://phflgbcqddfqrkodeyit.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_0IVFq4OoaxKOYm9L08b29Q_mg2yDOF_
```

## 6. Funciones Disponibles

### Autenticación (supabaseClient.js)

- `signUp(email, password)` - Registrarse
- `signIn(email, password)` - Iniciar sesión
- `signOut()` - Cerrar sesión
- `getCurrentUser()` - Obtener usuario actual

### Base de Datos (supabaseClient.js)

- `getFoundations()` - Obtener todas las fundaciones
- `getCampaigns()` - Obtener todas las campañas
- `getDonors()` - Obtener todos los donantes
- `createFoundation(data)` - Crear fundación
- `createCampaign(data)` - Crear campaña
- `createDonor(data)` - Crear donante

### Utilidades (databaseUtils.js)

- `getDonorProfile(userId)` - Obtener perfil de donante
- `getFoundationProfile(userId)` - Obtener perfil de fundación
- `searchFoundations(searchTerm, category)` - Buscar fundaciones
- `getActiveCampaigns()` - Obtener campañas activas
- `makeDonation(donationData)` - Hacer donación
- `uploadDonorProfileImage(donorId, file)` - Subir imagen de perfil

### Almacenamiento (supabaseClient.js)

- `uploadFile(bucket, filePath, file)` - Subir archivo
- `deleteFile(bucket, filePath)` - Eliminar archivo
- `getFileUrl(bucket, filePath)` - Obtener URL pública

## 7. Próximos Pasos

1. ✅ Instalar @supabase/supabase-js
2. ✅ Crear archivo de configuración (supabaseClient.js)
3. ✅ Actualizar AuthContext
4. 📋 Crear las tablas en Supabase (ver paso 1 arriba)
5. 📋 Crear los buckets de Storage (ver paso 2 arriba)
6. 📋 Integrar en componentes de tu aplicación
7. 📋 Probar la aplicación

## Soporte

Para más información sobre Supabase:

- Documentación: https://supabase.com/docs
- Dashboard: https://app.supabase.com

¡Listo! Tu aplicación está configurada para trabajar con Supabase.
