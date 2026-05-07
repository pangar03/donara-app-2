import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { DonараLogo, ArrowLeft, CheckCircleIcon } from '../components/ui';

// ─── Shared split layout ───────────────────────────────────────────────────────
function AuthLayout({ children }) {
	return (
		<div className='min-h-screen bg-white'>
			<div className='flex min-h-[calc(100vh-64px)]'>
				{/* Blue panel */}
				<div className='hidden md:flex w-5/12 bg-blue-600 flex-col items-center justify-center p-10 relative overflow-hidden'>
					<DonараLogo white />
					{/* Decorative hands SVG */}
					<div className='mt-12 opacity-70'>
						<svg viewBox='0 0 300 280' className='w-72' fill='none'>
							<path
								d='M60 200 C80 160 120 140 150 180 C180 140 220 155 240 195'
								stroke='white'
								strokeWidth='3'
								strokeLinecap='round'
								fill='none'
							/>
							<ellipse cx='100' cy='195' rx='55' ry='30' fill='rgba(255,255,255,0.15)' />
							<path
								d='M70 190 C85 170 110 165 130 180 C140 170 165 165 180 175 C185 165 195 162 205 168'
								stroke='white'
								strokeWidth='2.5'
								strokeLinecap='round'
								fill='none'
							/>
							<path
								d='M55 205 C70 185 100 175 125 185'
								stroke='white'
								strokeWidth='2'
								strokeLinecap='round'
								fill='none'
							/>
							<path
								d='M175 178 C190 168 215 165 235 178 C245 168 260 165 270 175'
								stroke='white'
								strokeWidth='2.5'
								strokeLinecap='round'
								fill='none'
							/>
							<circle cx='148' cy='175' r='4' fill='white' opacity='0.5' />
						</svg>
					</div>
				</div>
				{/* Form area */}
				<div className='flex-1 flex flex-col justify-center px-6 sm:px-12 py-10'>
					{children}
				</div>
			</div>
		</div>
	);
}

// ─── Step indicator ────────────────────────────────────────────────────────────
function StepDots({ total, current }) {
	return (
		<div className='flex items-center gap-2 mb-6'>
			{Array.from({ length: total }).map((_, i) => (
				<div key={i} className='flex items-center gap-2'>
					<div
						className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${i < current ? 'bg-blue-600 text-white' : i === current ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}
					>
						{i + 1}
					</div>
					{i < total - 1 && <div className={`h-0.5 w-8 ${i < current ? 'bg-blue-600' : 'bg-gray-200'}`} />}
				</div>
			))}
			<span className='ml-auto text-sm text-gray-500'>
				Paso {current + 1} de {total}
			</span>
		</div>
	);
}

// ─── Input ─────────────────────────────────────────────────────────────────────
function Input({ label, required, type = 'text', placeholder, value, onChange }) {
	return (
		<div className='flex flex-col gap-1'>
			{label && (
				<label className='text-sm font-medium text-gray-700'>
					{label}
					{required && ' *'}
				</label>
			)}
			<input
				type={type}
				placeholder={placeholder}
				value={value}
				onChange={(e) => onChange(e.target.value)}
				className='border border-gray-200 bg-gray-50 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
			/>
		</div>
	);
}

function Select({ label, required, options, value, onChange }) {
	return (
		<div className='flex flex-col gap-1'>
			{label && (
				<label className='text-sm font-medium text-gray-700'>
					{label}
					{required && ' *'}
				</label>
			)}
			<select
				value={value}
				onChange={(e) => onChange(e.target.value)}
				className='border border-gray-200 bg-gray-50 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
			>
				<option value=''>Selecciona...</option>
				{options.map((o) => (
					<option key={o} value={o}>
						{o}
					</option>
				))}
			</select>
		</div>
	);
}

// ─── LOGIN ─────────────────────────────────────────────────────────────────────
export function LoginPage({ onRegister, onLoggedIn }) {
	const { login } = useAuth();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [remember, setRemember] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const handleSubmit = async () => {
		try {
			setError('');
			setLoading(true);

			if (!email || !password) {
				setError('Por favor completa todos los campos');
				return;
			}

			await login(email, password);
			onLoggedIn();
		} catch (err) {
			setError(err.message || 'Error al iniciar sesión');
		} finally {
			setLoading(false);
		}
	};

	return (
		<AuthLayout>
			<div className='max-w-md w-full mx-auto'>
				<h1 className='text-3xl font-bold text-gray-900 mb-1'>Bienvenido</h1>
				<p className='text-gray-500 mb-8 text-sm'>Inicia sesión en tu cuenta</p>
				<div className='space-y-4'>
					{error && (
						<div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm'>{error}</div>
					)}
					<Input
						label='Correo Electrónico'
						type='email'
						placeholder='ejemplo@correo.com'
						value={email}
						onChange={setEmail}
					/>
					<Input label='Contraseña' type='password' placeholder='••••••••' value={password} onChange={setPassword} />
					<div className='flex items-center justify-between'>
						<label className='flex items-center gap-2 text-sm text-gray-700 cursor-pointer'>
							<input
								type='checkbox'
								checked={remember}
								onChange={(e) => setRemember(e.target.checked)}
								className='rounded'
							/>
							Recordarme
						</label>
						<button className='text-sm text-blue-600 hover:underline'>¿Olvidaste tu contraseña?</button>
					</div>
					<button
						onClick={handleSubmit}
						disabled={loading}
						className='w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed'
					>
						{loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
					</button>
					<div className='flex items-center gap-3'>
						<div className='flex-1 h-px bg-gray-200' />
						<span className='text-sm text-gray-400'>O continúa con</span>
						<div className='flex-1 h-px bg-gray-200' />
					</div>
					<div className='grid grid-cols-2 gap-3'>
						{['Google', 'Facebook'].map((provider) => (
							<button
								key={provider}
								className='flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-2.5 text-sm font-medium hover:bg-gray-50'
							>
								{provider === 'Google' ? (
									<svg className='w-4 h-4' viewBox='0 0 24 24'>
										<path d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z' fill='#4285F4' />
										<path d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z' fill='#34A853' />
										<path d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z' fill='#FBBC05' />
										<path d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z' fill='#EA4335' />
									</svg>
								) : (
									<svg className='w-4 h-4' viewBox='0 0 24 24' fill='#1877F2'>
										<path d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' />
									</svg>
								)}
								{provider}
							</button>
						))}
					</div>
					<p className='text-center text-sm text-gray-500'>
						¿No tienes una cuenta?{' '}
						<button onClick={onRegister} className='text-blue-600 font-medium hover:underline'>
							Regístrate aquí
						</button>
					</p>
				</div>
			</div>
		</AuthLayout>
	);
}

// ─── REGISTER TYPE SELECTOR ────────────────────────────────────────────────────
export function RegisterTypePage({ onSelect, onBack }) {
	return (
		<AuthLayout>
			<div className='max-w-md w-full mx-auto'>
				<h1 className='text-3xl font-bold text-gray-900 mb-1'>Registro</h1>
				<p className='text-gray-500 mb-8 text-sm'>Selecciona el tipo de cuenta</p>
				<div className='space-y-4'>
					{[
						{ key: 'donor', title: 'Soy Donante', desc: 'Regístrate para hacer donaciones y apoyar causas' },
						{ key: 'foundation', title: 'Soy Fundación', desc: 'Regístrate para recibir donaciones y gestionar campañas' },
					].map((opt) => (
						<button
							key={opt.key}
							onClick={() => onSelect(opt.key)}
							className='w-full text-left border border-gray-200 rounded-xl p-5 hover:border-blue-400 hover:bg-blue-50 transition-all'
						>
							<p className='font-semibold text-gray-900'>{opt.title}</p>
							<p className='text-sm text-gray-500 mt-0.5'>{opt.desc}</p>
						</button>
					))}
					<p className='text-center text-sm text-gray-500'>
						¿Ya tienes cuenta?{' '}
						<button onClick={onBack} className='text-blue-600 font-medium hover:underline'>
							Inicia sesión
						</button>
					</p>
				</div>
			</div>
		</AuthLayout>
	);
}

// ─── DONOR REGISTER ────────────────────────────────────────────────────────────
export function DonorRegisterPage({ onBack, onComplete }) {
	const { signup } = useAuth();
	const [step, setStep] = useState(0);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [form, setForm] = useState({
		name: '',
		email: '',
		password: '',
		confirm: '',
		phone: '',
		city: '',
		country: '',
		donationType: '',
		range: '',
		causes: [],
		anon: false,
		notifications: true,
	});
	const set = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));
	const toggleCause = (c) =>
		setForm((f) => ({
			...f,
			causes: f.causes.includes(c) ? f.causes.filter((x) => x !== c) : [...f.causes, c],
		}));

	const handleRegister = async () => {
		try {
			if (!form.name.trim()) { setError('Por favor ingresa tu nombre'); return; }
			if (!form.email.trim()) { setError('Por favor ingresa tu correo'); return; }
			if (!form.password) { setError('Por favor ingresa una contraseña'); return; }
			if (form.password !== form.confirm) { setError('Las contraseñas no coinciden'); return; }
			if (form.password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres'); return; }

			setLoading(true);
			setError('');

			await signup(
				form.email,
				form.password,
				{
					first_name: form.name,
					phone: form.phone || null,
					city: form.city || null,
					country: form.country || null,
					donation_type: form.donationType || null,
					donation_range: form.range || null,
					causes_interest: form.causes,
					anonymous_preference: form.anon,
					notifications_enabled: form.notifications,
				},
				'donor',
			);
			onComplete();
		} catch (err) {
			setError(err.message || 'Error al registrarse. Por favor intenta de nuevo.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<AuthLayout>
			<div className='max-w-lg w-full mx-auto'>
				<div className='flex items-center gap-3 mb-6'>
					<button
						onClick={step === 0 ? onBack : () => setStep(0)}
						className='flex items-center gap-1 text-blue-600 text-sm font-medium'
					>
						<ArrowLeft /> Volver
					</button>
					<h1 className='text-2xl font-bold text-gray-900'>Registro de Donante</h1>
				</div>
				<div className='bg-white border border-gray-100 rounded-2xl p-6 shadow-sm'>
					<StepDots total={2} current={step} />
					{step === 0 ? (
						<div>
							<h2 className='text-lg font-semibold text-gray-900 mb-5'>Datos Personales</h2>
							<div className='space-y-4'>
								<Input label='Nombre Completo' required placeholder='Ingresa tu nombre completo' value={form.name} onChange={set('name')} />
								<div className='grid grid-cols-2 gap-3'>
									<Input label='Correo Electrónico' required type='email' placeholder='ejemplo@correo.com' value={form.email} onChange={set('email')} />
									<Input label='Teléfono' placeholder='+57 300 123 4567' value={form.phone} onChange={set('phone')} />
								</div>
								<div className='grid grid-cols-2 gap-3'>
									<Input label='Contraseña' required type='password' placeholder='••••••••' value={form.password} onChange={set('password')} />
									<Input label='Confirmar Contraseña' required type='password' placeholder='••••••••' value={form.confirm} onChange={set('confirm')} />
								</div>
								<div className='grid grid-cols-2 gap-3'>
									<Input label='Ciudad' placeholder='Bogotá' value={form.city} onChange={set('city')} />
									<Input label='País' placeholder='Colombia' value={form.country} onChange={set('country')} />
								</div>
								<div className='flex justify-end pt-2'>
									<button onClick={() => setStep(1)} className='bg-blue-600 text-white px-8 py-2.5 rounded-xl font-semibold hover:bg-blue-700'>
										Continuar
									</button>
								</div>
							</div>
						</div>
					) : (
						<div>
							<h2 className='text-lg font-semibold text-gray-900 mb-5'>Preferencias de Donación</h2>
							<div className='space-y-4'>
								<Select label='Tipo de Donación Preferida' options={['Puntual', 'Recurrente', 'Ambos']} value={form.donationType} onChange={set('donationType')} />
								<Select label='Rango de Aporte Estimado' options={['$5.000 - $20.000', '$20.000 - $50.000', '$50.000 - $100.000', 'Más de $100.000']} value={form.range} onChange={set('range')} />
								<div>
									<p className='text-sm font-medium text-gray-700 mb-2'>Causas de Interés</p>
									<div className='grid grid-cols-2 gap-2'>
										{['Salud', 'Educación', 'Alimentación', 'Animales', 'Medio Ambiente', 'Deportes'].map((c) => (
											<label key={c} className='flex items-center gap-2 text-sm text-gray-700 cursor-pointer'>
												<input type='checkbox' checked={form.causes.includes(c)} onChange={() => toggleCause(c)} className='rounded text-blue-600' />
												{c}
											</label>
										))}
									</div>
								</div>
								{[
									{ key: 'anon', label: 'Preferir anonimato en donaciones' },
									{ key: 'notifications', label: 'Recibir notificaciones sobre campañas' },
								].map((opt) => (
									<label key={opt.key} className='flex items-center gap-2 text-sm text-gray-700 cursor-pointer'>
										<input type='checkbox' checked={form[opt.key]} onChange={(e) => set(opt.key)(e.target.checked)} className='rounded text-blue-600' />
										{opt.label}
									</label>
								))}
								{error && (
									<div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm'>{error}</div>
								)}
								<div className='flex justify-between pt-2'>
									<button onClick={() => setStep(0)} className='border border-gray-300 px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50'>
										Atrás
									</button>
									<button
										onClick={handleRegister}
										disabled={loading}
										className='bg-blue-600 text-white px-8 py-2.5 rounded-xl font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed'
									>
										{loading ? 'Registrando...' : 'Registrarse'}
									</button>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</AuthLayout>
	);
}

// ─── FOUNDATION REGISTER ───────────────────────────────────────────────────────
export function FoundationRegisterPage({ onBack, onComplete }) {
	const { signup } = useAuth();
	const [step, setStep] = useState(0);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [form, setForm] = useState({
		legalName: '',
		initials: '',
		nit: '',
		type: '',
		date: '',
		city: '',
		country: '',
		rep: '',
		docType: '',
		docNum: '',
		role: '',
		email: '',
		phone: '',
		description: '',
		category: '',
		coverage: '',
		beneficiaries: '',
		website: '',
		social: '',
		bank: '',
		accountType: '',
		accountNum: '',
		holder: '',
	});
	const set = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));

	const [docs, setDocs] = useState({
		rut: null,
		camaraComercio: null,
		docIdentidad: null,
		certBancaria: null,
		actaConstitucion: null,
	});

	const setDoc = (key, file) =>
		setDocs((d) => ({ ...d, [key]: file ? { name: file.name, file } : null }));
	const removeDoc = (key) => setDocs((d) => ({ ...d, [key]: null }));

	// TODO: Verificar e implementar la lógica de subida de documentos a supabase storage.
	const handleSubmit = async () => {
		try {
			setError('');
			setLoading(true);

			await signup(
				form.email,
				form.password,
				{
					legal_name: form.legalName,
					initials: form.initials || null,
					nit: form.nit,
					type: form.type,
					constitution_date: form.date || null,
					city: form.city,
					country: form.country,
					legal_rep: form.rep,
					doc_type: form.docType,
					doc_num: form.docNum,
					role: form.role,
					phone: form.phone,
					description: form.description,
					category: form.category,
					coverage: form.coverage || null,
					beneficiaries: form.beneficiaries || null,
					website: form.website || null,
					social: form.social || null,
					bank: form.bank,
					account_type: form.accountType,
					account_num: form.accountNum,
					holder: form.holder,
				},
				'foundation',
			);
			onComplete();
		} catch (err) {
			setError(err.message || 'Error al registrarse. Por favor intenta de nuevo.');
		} finally {
			setLoading(false);
		}
	};

	const DOC_FIELDS = [
		{ key: 'rut', label: 'RUT', required: true, accept: '.pdf,.jpg,.jpeg,.png' },
		{ key: 'camaraComercio', label: 'Certificado Cámara de Comercio', required: true, accept: '.pdf,.jpg,.jpeg,.png' },
		{ key: 'docIdentidad', label: 'Documento de identidad del representante', required: true, accept: '.pdf,.jpg,.jpeg,.png' },
		{ key: 'certBancaria', label: 'Certificación bancaria', required: true, accept: '.pdf,.jpg,.jpeg,.png' },
		{ key: 'actaConstitucion', label: 'Acta de constitución (opcional)', required: false, accept: '.pdf,.jpg,.jpeg,.png' },
	];

	const steps = [
		{
			title: 'Identificación Básica',
			fields: (
				<div className='space-y-4'>
					<div className='grid grid-cols-3 gap-3'>
						<div className='col-span-2'>
							<Input label='Nombre Legal' required placeholder='Fundación...' value={form.legalName} onChange={set('legalName')} />
						</div>
						<Input label='Sigla' placeholder='FUND' value={form.initials} onChange={set('initials')} />
					</div>
					<div className='grid grid-cols-3 gap-3'>
						<Input label='NIT' required placeholder='900.123.456-7' value={form.nit} onChange={set('nit')} />
						<Select label='Tipo' required options={['Fundación', 'ONG', 'Asociación', 'Corporación']} value={form.type} onChange={set('type')} />
						<Input label='Fecha Constitución' type='date' value={form.date} onChange={set('date')} />
					</div>
					<div className='grid grid-cols-2 gap-3'>
						<Input label='Ciudad' required placeholder='Bogotá' value={form.city} onChange={set('city')} />
						<Input label='País' required placeholder='Colombia' value={form.country} onChange={set('country')} />
					</div>
				</div>
			),
		},
		{
			title: 'Representación Legal',
			fields: (
				<div className='space-y-4'>
					<Input label='Representante Legal' required placeholder='Nombre completo' value={form.rep} onChange={set('rep')} />
					<div className='grid grid-cols-3 gap-3'>
						<Select label='Tipo Documento' required options={['CC', 'CE', 'Pasaporte']} value={form.docType} onChange={set('docType')} />
						<Input label='Número' required placeholder='123456789' value={form.docNum} onChange={set('docNum')} />
						<Input label='Cargo' required placeholder='Director...' value={form.role} onChange={set('role')} />
					</div>
					<div className='grid grid-cols-2 gap-3'>
						<Input label='Email Institucional' required type='email' placeholder='contacto@fundacion.org' value={form.email} onChange={set('email')} />
						<Input label='Teléfono' required placeholder='+57 1 234 5678' value={form.phone} onChange={set('phone')} />
					</div>
				</div>
			),
		},
		{
			title: 'Información Institucional',
			fields: (
				<div className='space-y-4'>
					<div className='flex flex-col gap-1'>
						<label className='text-sm font-medium text-gray-700'>Descripción *</label>
						<textarea
							placeholder='Describe la misión...'
							value={form.description}
							onChange={(e) => set('description')(e.target.value)}
							className='border border-gray-200 bg-gray-50 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none'
						/>
					</div>
					<div className='grid grid-cols-2 gap-3'>
						<Select label='Categoría' required options={['Educación', 'Salud', 'Animales', 'Medio Ambiente', 'Alimentación', 'Deportes']} value={form.category} onChange={set('category')} />
						<Input label='Cobertura' placeholder='Local, Regional...' value={form.coverage} onChange={set('coverage')} />
					</div>
					<div className='flex flex-col gap-1'>
						<label className='text-sm font-medium text-gray-700'>Beneficiarios</label>
						<textarea
							placeholder='Describe los beneficiarios...'
							value={form.beneficiaries}
							onChange={(e) => set('beneficiaries')(e.target.value)}
							className='border border-gray-200 bg-gray-50 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 h-20 resize-none'
						/>
					</div>
					<div className='grid grid-cols-2 gap-3'>
						<Input label='Sitio Web' placeholder='https://...' value={form.website} onChange={set('website')} />
						<Input label='Redes Sociales' placeholder='@fundacion' value={form.social} onChange={set('social')} />
					</div>
				</div>
			),
		},
		{
			title: 'Datos Financieros y Documentos',
			fields: (
				<div className='space-y-4'>
					<div className='grid grid-cols-2 gap-3'>
						<Input label='Banco' required placeholder='Banco...' value={form.bank} onChange={set('bank')} />
						<Select label='Tipo Cuenta' required options={['Ahorros', 'Corriente']} value={form.accountType} onChange={set('accountType')} />
					</div>
					<div className='grid grid-cols-2 gap-3'>
						<Input label='Número de Cuenta' required placeholder='1234567890' value={form.accountNum} onChange={set('accountNum')} />
						<Input label='Titular' required placeholder='Nombre titular' value={form.holder} onChange={set('holder')} />
					</div>

					{/* Document uploads */}
					<div className='pt-2'>
						<p className='text-sm font-semibold text-gray-800 mb-1'>Documentos Requeridos</p>
						<p className='text-xs text-gray-400 mb-4'>Sube cada documento en formato PDF, JPG o PNG. Máximo 10 MB por archivo.</p>
						<div className='space-y-3'>
							{DOC_FIELDS.map(({ key, label, required, accept }) => {
								const uploaded = docs[key];
								return (
									<div
										key={key}
										className={`border rounded-xl p-3 transition-colors ${uploaded ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-gray-50'}`}
									>
										<div className='flex items-center justify-between gap-3'>
											<div className='flex items-center gap-2 min-w-0'>
												{uploaded ? (
													<div className='w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0'>
														<CheckCircleIcon className='w-4 h-4 text-green-600' />
													</div>
												) : (
													<div className='w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0'>
														<svg className='w-4 h-4 text-gray-500' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
															<path strokeLinecap='round' d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
														</svg>
													</div>
												)}
												<div className='min-w-0'>
													<p className='text-sm font-medium text-gray-800 leading-tight'>
														{label}
														{required && <span className='text-red-500 ml-0.5'>*</span>}
													</p>
													{uploaded ? (
														<p className='text-xs text-green-600 truncate'>{uploaded.name}</p>
													) : (
														<p className='text-xs text-gray-400'>Sin archivo seleccionado</p>
													)}
												</div>
											</div>
											<div className='flex items-center gap-2 flex-shrink-0'>
												{uploaded && (
													<button type='button' onClick={() => removeDoc(key)} className='text-xs text-red-500 hover:text-red-700 font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors'>
														Eliminar
													</button>
												)}
												<label className='cursor-pointer'>
													<input type='file' accept={accept} className='sr-only' onChange={(e) => setDoc(key, e.target.files?.[0] || null)} />
													<span className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${uploaded ? 'bg-white border border-green-300 text-green-700 hover:bg-green-50' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
														<svg className='w-3 h-3' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2.5}>
															<path strokeLinecap='round' d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12' />
														</svg>
														{uploaded ? 'Cambiar' : 'Subir'}
													</span>
												</label>
											</div>
										</div>
									</div>
								);
							})}
						</div>
						<div className='mt-3 flex items-center gap-2'>
							<div className='flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden'>
								<div
									className='h-full bg-blue-600 rounded-full transition-all'
									style={{ width: `${(Object.values(docs).filter(Boolean).length / DOC_FIELDS.length) * 100}%` }}
								/>
							</div>
							<span className='text-xs text-gray-500 flex-shrink-0'>
								{Object.values(docs).filter(Boolean).length}/{DOC_FIELDS.length} documentos
							</span>
						</div>
					</div>
				</div>
			),
		},
	];

	return (
		<AuthLayout>
			<div className='max-w-lg w-full mx-auto'>
				<div className='flex items-center gap-3 mb-6'>
					<button
						onClick={step === 0 ? onBack : () => setStep((s) => s - 1)}
						className='flex items-center gap-1 text-blue-600 text-sm font-medium'
					>
						<ArrowLeft /> Volver
					</button>
					<h1 className='text-2xl font-bold text-gray-900'>Registro de Fundación</h1>
				</div>
				<div className='bg-white border border-gray-100 rounded-2xl p-6 shadow-sm'>
					{error && (
						<div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4'>{error}</div>
					)}
					<StepDots total={4} current={step} />
					<h2 className='text-lg font-semibold text-gray-900 mb-5'>{steps[step].title}</h2>
					{steps[step].fields}
					<div className='flex justify-between pt-6'>
						{step > 0 ? (
							<button onClick={() => setStep((s) => s - 1)} className='border border-gray-300 px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50'>
								Atrás
							</button>
						) : (
							<div />
						)}
						{step < steps.length - 1 ? (
							<button onClick={() => setStep((s) => s + 1)} className='bg-blue-600 text-white px-8 py-2.5 rounded-xl font-semibold hover:bg-blue-700'>
								Continuar
							</button>
						) : (
							<button
								onClick={handleSubmit}
								disabled={loading}
								className='bg-blue-600 text-white px-8 py-2.5 rounded-xl font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed'
							>
								{loading ? 'Registrando...' : 'Enviar Registro'}
							</button>
						)}
					</div>
				</div>
			</div>
		</AuthLayout>
	);
}