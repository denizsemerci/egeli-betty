import { NextRequest, NextResponse } from 'next/server'

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, displayName } = body

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Geçerli bir e-posta adresi girin' },
        { status: 400 }
      )
    }

    // In a real app, this would update the database
    // For now, we'll return success
    // The client-side code handles localStorage
    
    return NextResponse.json({
      success: true,
      message: 'Profil bilgileri güncellendi',
      data: { email, displayName },
    })
  } catch (error: any) {
    console.error('Error updating profile:', error)
    return NextResponse.json(
      { error: error.message || 'Profil güncellenirken bir hata oluştu' },
      { status: 500 }
    )
  }
}

