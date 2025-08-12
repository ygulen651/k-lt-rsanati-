import Link from "next/link"
import Image from "next/image"
import { User, Mail, Phone, Briefcase, MapPin, Calendar, Edit, Trash2, Eye } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface MemberCardProps {
  member: {
    _id: string
    firstName: string
    lastName: string
    email: string
    phone: string
    profileImage?: string
    workInfo: {
      workplace: string
      position: string
      department?: string
    }
    address?: {
      city?: string
      district?: string
    }
    membershipInfo?: {
      membershipType: 'active' | 'passive' | 'retired' | 'suspended'
      joinDate?: string
    }
    status: 'active' | 'inactive' | 'pending'
    createdAt: string
  }
  showActions?: boolean
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  onView?: (id: string) => void
  variant?: 'default' | 'compact' | 'detailed'
}

export function MemberCard({ 
  member, 
  showActions = false, 
  onEdit, 
  onDelete, 
  onView,
  variant = 'default' 
}: MemberCardProps) {
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'inactive': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Aktif'
      case 'inactive': return 'Pasif'
      case 'pending': return 'Beklemede'
      default: return 'Bilinmeyen'
    }
  }

  const getMembershipTypeColor = (type: string) => {
    switch (type) {
      case 'active': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'passive': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
      case 'retired': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
      case 'suspended': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getMembershipTypeLabel = (type: string) => {
    switch (type) {
      case 'active': return 'Aktif Üye'
      case 'passive': return 'Pasif Üye'
      case 'retired': return 'Emekli Üye'
      case 'suspended': return 'Askıya Alınmış'
      default: return 'Bilinmeyen'
    }
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  if (variant === 'compact') {
    return (
      <Card className="group hover:shadow-md transition-all duration-300">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="flex-shrink-0">
              {member.profileImage ? (
                <Image
                  src={member.profileImage}
                  alt={`${member.firstName} ${member.lastName}`}
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                  <span className="text-red-600 dark:text-red-400 font-medium text-sm">
                    {getInitials(member.firstName, member.lastName)}
                  </span>
                </div>
              )}
            </div>

            {/* İçerik */}
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 dark:text-white truncate">
                {member.firstName} {member.lastName}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                {member.workInfo.workplace}
              </p>
            </div>

            {/* Durum */}
            <div className="flex-shrink-0">
              <Badge className={cn("text-xs", getStatusColor(member.status))}>
                {getStatusLabel(member.status)}
              </Badge>
            </div>

            {/* Aksiyonlar */}
            {showActions && (
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {onView && (
                  <button
                    onClick={() => onView(member._id)}
                    className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                )}
                {onEdit && (
                  <button
                    onClick={() => onEdit(member._id)}
                    className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(member._id)}
                    className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      <Link href={`/admin/uyeler/${member._id}`} className="block">
        <CardHeader className="pb-4">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="flex-shrink-0">
              {member.profileImage ? (
                <Image
                  src={member.profileImage}
                  alt={`${member.firstName} ${member.lastName}`}
                  width={64}
                  height={64}
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                  <span className="text-red-600 dark:text-red-400 font-medium text-lg">
                    {getInitials(member.firstName, member.lastName)}
                  </span>
                </div>
              )}
            </div>

            {/* Ana Bilgiler */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white group-hover:text-red-600 transition-colors">
                {member.firstName} {member.lastName}
              </h3>
              
              {/* İş Bilgileri */}
              <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400 mt-1">
                <Briefcase className="h-4 w-4" />
                <span className="text-sm truncate">
                  {member.workInfo.position} • {member.workInfo.workplace}
                </span>
              </div>

              {/* Konum */}
              {member.address?.city && (
                <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 mt-1">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">
                    {member.address.district && `${member.address.district}, `}{member.address.city}
                  </span>
                </div>
              )}
            </div>

            {/* Durumlar */}
            <div className="flex flex-col gap-2 items-end">
              <Badge className={cn("text-xs", getStatusColor(member.status))}>
                {getStatusLabel(member.status)}
              </Badge>
              
              {member.membershipInfo?.membershipType && (
                <Badge className={cn("text-xs", getMembershipTypeColor(member.membershipInfo.membershipType))}>
                  {getMembershipTypeLabel(member.membershipInfo.membershipType)}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* İletişim Bilgileri */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Mail className="h-4 w-4" />
              <span className="truncate">{member.email}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Phone className="h-4 w-4" />
              <span>{member.phone}</span>
            </div>
          </div>

          {/* Üyelik Tarihi */}
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <Calendar className="h-3 w-3" />
            <span>
              Üye: {new Date(member.membershipInfo?.joinDate || member.createdAt).toLocaleDateString('tr-TR')}
            </span>
          </div>

          {/* Aksiyonlar */}
          {showActions && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
              {onView && (
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    onView(member._id)
                  }}
                  className="flex items-center gap-1 px-3 py-1 text-xs bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
                >
                  <Eye className="h-3 w-3" />
                  Görüntüle
                </button>
              )}
              
              {onEdit && (
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    onEdit(member._id)
                  }}
                  className="flex items-center gap-1 px-3 py-1 text-xs bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg transition-colors"
                >
                  <Edit className="h-3 w-3" />
                  Düzenle
                </button>
              )}
              
              {onDelete && (
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    onDelete(member._id)
                  }}
                  className="flex items-center gap-1 px-3 py-1 text-xs bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                >
                  <Trash2 className="h-3 w-3" />
                  Sil
                </button>
              )}
            </div>
          )}
        </CardContent>
      </Link>
    </Card>
  )
}


