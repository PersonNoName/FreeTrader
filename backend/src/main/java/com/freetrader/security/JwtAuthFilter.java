package com.freetrader.security;

import com.freetrader.service.CacheService;
import com.freetrader.util.SecurityConstants;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {
    
    private final JwtUtils jwtUtils;
    private final UserDetailsService userDetailsService;
    private final CacheService cacheService;
    
    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        
        final String authHeader = request.getHeader(SecurityConstants.AUTHORIZATION_HEADER);
        final String jwt;
        final String username;
        
        if (authHeader == null || !authHeader.startsWith(SecurityConstants.TOKEN_PREFIX)) {
            filterChain.doFilter(request, response);
            return;
        }
        
        jwt = authHeader.substring(SecurityConstants.TOKEN_PREFIX.length());
        
        try {
            if (cacheService.isTokenBlacklisted(jwt)) {
                log.debug("Token已被加入黑名单");
                filterChain.doFilter(request, response);
                return;
            }

            if (!jwtUtils.isAccessToken(jwt)) {
                log.debug("Token类型不是AccessToken");
                filterChain.doFilter(request, response);
                return;
            }

            username = jwtUtils.extractUsername(jwt);
            
            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);
                
                if (jwtUtils.validateToken(jwt, userDetails)) {
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        } catch (Exception e) {
            log.debug("JWT token验证失败: {}", e.getMessage());
        }
        
        filterChain.doFilter(request, response);
    }
}
