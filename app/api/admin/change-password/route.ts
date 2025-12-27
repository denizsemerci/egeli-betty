import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { currentPassword, newPassword } = body

    // Validate inputs
    if (!currentPassword) {
      return NextResponse.json(
        { error: 'Mevcut şifrenizi girin' },
        { status: 400 }
      )
    }

    if (!newPassword || newPassword.length < 4) {
      return NextResponse.json(
        { error: 'Yeni şifre en az 4 karakter olmalıdır' },
        { status: 400 }
      )
    }

    // Verify current password
    // In a real app, this would check against the database
    // For now, we'll check against the hardcoded password
    if (currentPassword !== '123') {
      return NextResponse.json(
        { error: 'Mevcut şifre hatalı' },
        { status: 401 }
      )
    }

    // In a real app, this would update the password in the database
    // For now, we'll just return success
    
    return NextResponse.json({
      success: true,
      message: 'Şifre başarıyla değiştirildi',
    })
  } catch (error: any) {
    console.error('Error changing password:', error)
    return NextResponse.json(
      { error: error.message || 'Şifre değiştirilirken bir hata oluştu' },
      { status: 500 }
    )
  }
}

